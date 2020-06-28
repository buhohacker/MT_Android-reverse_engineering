#!/usr/bin/python3

# -- @Autora: Andrea del Nido García

### Script checks if the output files from find_libraries_pinning.sh are empty or not
### If not then exists certificate pinning package/library

import os
import csv
#import pandas as pd


  
def checkFile(file):
    if os.stat(file).st_size == 0:
        flag = False
    else:
        flag = True
    return flag
    
    
if __name__ == "__main__":

    # Listar directorios de Files, acceder a cada uno de ellos
    listDir = os.listdir("/home/buhohacker/Documentos/Resources/Files/")
    # Comprobar si existen ya CSV, si existen --> eliminarlos
    
    
    for i in listDir:
        var = "/home/buhohacker/Documentos/Resources/Files/" + i + "/"
        listFiles = os.listdir(var)
        
        # Eliminar anteriores CSV y evitar que se dupliquen filas
        #listF = listFiles.pop()
        #de = var + listF
        #os.remove(de)
        
        for j in listFiles:
                   
            # Esta parte se utiliza para eliminar el ".json"
            if j.find(".json") >= 0:
                temp = len(j)
                clearListFiles = j[:temp - 5]
            
            # Limpiar direcorios con posibles csv anteriores
            oldcsv = var + clearListFiles + ".csv"
            if os.path.exists(oldcsv):
                os.remove(oldcsv)
            
            # Obtener la ruta completa con cada fichero concreto de libreria y comprobar
            if j.find(".json") >= 0:
                file = var + j
                check = checkFile(file)
            
            # Preparar parametros entrada para funcion csv
            namecsv = i + ".csv"
            routecsv = var + namecsv
            # Abrir/crear fichero csv
            filecsv = open(routecsv,"a")
            
            if check == True:
                 lis = [i, clearListFiles, True]
                 spamreader = csv.writer(filecsv)
                 spamreader.writerow(lis)
                 #generateCSV(lis, routecsv)
                 print("CSV: " + namecsv + " created successfully")
            elif check == False:
                 lis = [i, clearListFiles, False]
                 spamreader = csv.writer(filecsv)
                 spamreader.writerow(lis)
                 #generateCSV(lis, routecsv)
                 print("CSV: " + namecsv + " created successfully")
            else:
                 print("******** ERROR ***********")
            # Cerrar csv
            filecsv.close()
            
            
            
             
