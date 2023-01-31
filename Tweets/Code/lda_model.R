# set options
options(stringsAsFactors = F)         # no automatic data transformation
options("scipen" = 100, "digits" = 4) # suppress math annotation
# load packages
library(knitr) 
library(kableExtra) 
library(DT)
library(tm)
library(topicmodels)
library(reshape2)
library(ggplot2)
library(wordcloud)
library(pals)
library(SnowballC)
library(lda)
library(ldatuning)
library(flextable)
library(tidyverse)
# activate klippy for copy-to-clipboard button
klippy::klippy()

# load data
textdata <- read.csv("statements.csv") %>% 
  filter(opensecrets_id == "N00000153" | opensecrets_id == "N00000179")

K <- 5 # number of topics
n <- 1 # number of words per topic

get_topics <- function(text, doc_id) {
  gc()
  df <- data.frame(text, doc_id)
  corpus <- Corpus(DataframeSource(df))
  minimumFrequency <- 5
  DTM <- DocumentTermMatrix(corpus, 
                            control = list(bounds = list(global = c(minimumFrequency, Inf))))
  sel_idx <- slam::row_sums(DTM) > 0
  DTM <- DTM[sel_idx, ]
  df <- df[sel_idx, ]
  set.seed(111111)
  # compute the LDA model, inference via 1000 iterations of Gibbs sampling
  topicModel <- LDA(DTM, K, method="Gibbs", control=list(iter = 1000, verbose = 25))
  return(paste(terms(topicModel, n), collapse = " "))
}

lda_result <- textdata %>% 
  group_by(opensecrets_id) %>% 
  summarize(topics = get_topics(text, doc_id))







