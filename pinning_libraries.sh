#!/bin/bash

### Runs the files find _libraries_pinning.sh and check_pinning_library.py


# Begin execution time
start=`date +%s`


# Create new directories for the program (Scripts, Resources, Code, Files, Logs)


# Run find _libraries_pinning.sh
echo -e "\n####################################################\n"
echo -e "\n          STARTING find_libraries_pinning.sh        \n"
echo -e "\n####################################################\n"
bash find_libraries_pinning.sh
echo -e "\n####################################################\n"
echo -e "\n           END find_libraries_pinning.sh            \n"
echo -e "\n####################################################\n"


# Delete previous CSV files
dirFiles="/home/buhohacker/Documentos/Resources/Files"
dirLogs="/home/buhohacker/Documentos/Resources/Logs"
for file in $(ls $dirFiles)
do
    dirCSV=$dirFiles/$file
    fCSVname=$file".csv"
    for fileCSV in $(ls $dirCSV)
    do
        rm $dirCSV/$fCSVname &> $dirLogs/rm.log
    done
done


# Run check_pinning_library.py
echo -e "\n####################################################\n"
echo -e "\n           STARTING check_pinning_library.py        \n"
echo -e "\n####################################################\n"
python3 check_pinning_library.py
echo -e "\n####################################################\n"
echo -e "\n            END check_pinning_library.py            \n"
echo -e "\n####################################################\n"

# Execution time
end=`date +%s`
let total=$end-$start
echo -e "\n********** Execution time - $total s - **********\n"



