library(udpipe)
library(data.table)
library(stopwords)
library(BTM)

library(tidyverse)

set.seed(111111)
df <- read.csv("all_tweets_full_clean.csv")
df <- df %>% select(X, created_at, twitter, opensecrets_id, lemma_tokens) %>% 
  rename("doc_id" = "X", "text" = "lemma_tokens") %>% 
  filter(opensecrets_id == "N00000153" | opensecrets_id == "N00000179")

n <- 5

get_topics <- function(x, opensecrets_id) {
  gc()
  anno    <- udpipe(x, "english", trace = 10)
  biterms <- as.data.table(anno)
  biterms <- biterms[, cooccurrence(x = lemma,
                                    relevant = upos %in% c("NOUN", "ADJ", "VERB") &
                                      nchar(lemma) > 2 & !lemma %in% stopwords("en"),
                                    skipgram = 3),
                     by = list(doc_id)]
  traindata <- subset(anno, upos %in% c("NOUN", "ADJ", "VERB") & !lemma %in% stopwords("en") & nchar(lemma) > 2)
  traindata <- traindata[, c("doc_id", "lemma")]
  model     <- BTM(traindata, biterms = biterms, k = n, iter = 1000, background = TRUE, trace = 100)
  save(model, file = paste("BTM_Models/", gsub(" ", "", opensecrets_id) ,".RData", sep = ""))
  topic_list <- c()
  topics <- terms(model, top_n = 1)
  for (k in 1:n) {
    topic_list <- c(topic_list, topics[[k]][[1]])
  }
  return(paste(topic_list, collapse = " "))
}

btm_result <- df %>% 
  group_by(twitter, opensecrets_id) %>% 
  filter(twitter != "", opensecrets_id != "") %>% 
  summarize(topics = get_topics(text, opensecrets_id[1]))

write(df_results, "btm_results.csv")
