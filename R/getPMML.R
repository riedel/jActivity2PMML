saveModel <- function(sensor="orientation", classes=c("walking","sitting"), method="rpart")
{
  library(influxdbr2)
  library(xts)
  influx<-influx_connection(host = "css18.teco.edu",
                            port = 8086,
                            user = "css18",
                            pass = "css18")

  labels = lapply(classes,FUN=function(y) { paste("\"label\"='",y,"'",sep="") });
  query=paste("select * FROM",sensor,"WHERE",paste(labels,collapse=" OR "),"GROUP BY subject,label",sep=" " )
  
  result=influx_query_xts(influx,db="css18", query=query)

  library(foreach)  
  data=foreach(i=seq(1,length(result)),.combine=rbind) %do%
  {
    ts=result[[i]]
    r={}
    r$label=ts$tags$label
    r$subject=ts$tags$subject
    foreach(w=split.xts(ts$values,f="seconds",k=1),.combine = rbind) %do%
    {
      d3=sqrt((w$alpha-mean(w$alpha))^2+(w$beta-mean(w$beta))^2+(w$gamma-mean(w$gamma))^2)
      r$mean=mean(d3)
      r$sd=sd(d3)
      r$max=max(d3)
      as.data.frame(r)
    }
  }
  library(caret)
  data=na.omit(data)
  ctrl <- trainControl(method = "repeatedcv", repeats = 5,
                       classProbs = TRUE,
                       summaryFunction = twoClassSummary,
                       ## new option here:
                       sampling = "down")
  
  pmodel=train(subset(data,select=-c(label,subject)), data[,"label"], method = method, metric = "ROC", trControl = ctrl)
  library(pmml)
  p=pmml(model=pmodel$finalModel)
  savePMML(p,name=paste("inst/www/models/",paste(method,sensor,paste(classes,collapse = "_"),sep="_"),".pmml",sep=""))
  install()
}
saveModel()
