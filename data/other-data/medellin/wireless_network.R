# read files

library("jsonlite")
library(rgdal)

limite_comuna <- fromJSON("Límite_Comuna_Corregimiento.json", flatten = TRUE)
wifi_networks <-  read.csv("Puntos_de_navegacion_WiFi_gratis_en_Medell_n_-_para_ubicaci_n_en_el_mapa.csv") 

# count wifi networks in a comuna, transform to data frame, rename the columns
wifi_count <- as.data.frame(table(wifi_networks$Nombre.Comuna ))
colnames (wifi_count) <- c("comuna" , "count")

# uppercase for merging
limite_comuna$features$properties.NOMBRE <- toupper(limite_comuna$features$properties.NOMBRE)


# merge
df <- merge(limite_comuna, wifi_count,  by.x = "features.properties.NOMBRE"  , by.y =  "comuna"  )

df.SP <- SpatialPolygonsDataFrame(df$features.geometry.coordinates )

df <- df[c(2:6,1, 14)]

 
