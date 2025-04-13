#!/bin/bash

### Script that obtains apk code with apktool, then find common certificate  
### pinning libraries 
### Output --> json files with occurences 


directory="/home/buhohacker/Documentos/APKs"
dirInitialCode="/home/buhohacker/Documentos/Scripts"
dirFinalCode="/home/buhohacker/Documentos/Resources/Code"
dirFiles="/home/buhohacker/Documentos/Resources/Files"

# Eliminar cualquier directorio existente previo
rm -r $dirFinalCode/*
rm -r $dirFiles/*

for file in $(ls $directory)
do  
    echo -e "\nThe APK file is: $file..........................\n"
    echo "############### Starting Apktool ###############"
    apktool d $directory/$file
    #chmod 777 $directory/$file
    echo -e "################# End Apktool ##################\n"
        
    # Mover solamente los directorios que serán la salida de apktool --> if que verifique directorios
    for fileCode in $(ls $dirInitialCode)
    do
        echo 
        echo "Checking if $fileCode is APK directory......." 
        echo "............................................."
        if [ -d $fileCode ]
        then
            # Check if file with code does not exist in dirFinalCode
            if [ ! -d $dirFinalCode/$fileCode ]
            then 
                mv $fileCode $dirFinalCode
            else 
                echo "File $fileCode already exists........"
                echo "....................................."
                rm -r $fileCode
            fi
        else
            echo "File $fileCode is not APK directory......"
            echo "........................................."
        fi
        # Comprobar si en Code y Files hay directorios creados en ejecuciones previas != a las APKs actuales --> Eliminarlos
        #wthoapk=${file::-4} # Guardamos el nombre de cada apk actual  sin la extensión
        #echo $wthoapk
        #if [ $dirFinalCode/$wthoapk!=$dirFinalCode/$fileCode ]
        #echo $dirFinalCode/$wthoapk
        #echo $dirFinalCode/$fileCode
        #then
            # Eliminar directorios anteriores de APKs inexistentes 
            #rm -r $dirFinalCode/$wthoapk
            #echo -e "\nDirectorio $dirFinalCode/$wthoapk eliminado..................\n"
        #fi
     done
done


# Find security packages in smali code of apks, generates files with occurences
for fileCapk in $(ls $dirFinalCode)
do
    # Verificar previamente si existe el directorio
    if [ ! -d $dirFiles/$fileCapk ]
    then
        # Create directory for each apk
        echo "New directory $fileCapk create.............."
        mkdir $dirFiles/$fileCapk # --> Si se quiere actualizar sobreescribir directorio
        chmod 777 $dirFiles/$fileCapk
    else
        chmod 777 $dirFiles/$fileCapk
        echo "Directory" $fileCapk "already exists........"
        echo "Overwriting................................."
        echo "............................................"
    fi   
    
    # ------------------------------- OLD CASES -----------------------------------
    ### Case okhttp3 ###
    #grep -ri "okhttp3" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_okhttp3.json
    #chmod 777 $dirFiles/$fileCapk/file_okhttp3.json
    ### Case Trustkit ###
    #grep -ri "trustkit" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_trustkit.json  
    #chmod 777 $dirFiles/$fileCapk/file_trustkit.json 
    ### Case TrustManager ###
    #grep -ri "trustmanager" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_trustmanager.json
    #chmod 777 $dirFiles/$fileCapk/file_trustmanager.json  
    ### Case Appcelerator ###
    #grep -ri "appcelerator" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_appcelerator.json
    #chmod 777 $dirFiles/$fileCapk/appcelerator.json
    
    # ------------------------------- NEW CASES -----------------------------------
    ### Case OpenSSLSocketImpl ###
    grep -ri "opensslsocketimpl" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_opensslsocketimpl.json
    chmod 777 $dirFiles/$fileCapk/opensslsocketimpl.json
    ### Case OpenSSLEngineSocketImpl ###
    grep -ri "opensslenginesocketImpl" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_osslengsocketimpl.json
    chmod 777 $dirFiles/$fileCapk/opensslenginesocketimpl.json
    ### Case OpenSSLSocketImpl ###
    #grep -ri "opensslsocketimpl" $dirFinalCode/$fileCapk > $dirFiles/$fileCapk/file_opensslsocketimpl.json
    #chmod 777 $dirFiles/$fileCapk/file_opensslsocketimpl.json
done






