#!/usr/bin/python3

import os
from traffic import Traffic

file_list = os.listdir("/home/buhohacker/Documentos/apks")
print("The list of APKs is: ")
print(file_list)
act_path = os.getcwd()

print("Script trafficAll.py is in directory " + str(act_path))

# Llamar a traffic.py con todas las apks
for file_name in file_list:
    print("The actual APK for analyze traffic is: " + file_name)
    apk = "/home/buhohacker/Documentos/apks/" + str(file_name)
    t = Traffic("192.168.1.53", "4000", "192.168.3.20", apk, "Label_PinningTest")
    print(t.configure())
    print(t.upload())
    print(t.phaseOne(25,False, False))
    print(t.phaseTwo(25, True))
    print(t.analysis())
    print(t.result())
    print(t.sanitize())
