
###
El script pinning_libraries.sh ejecuta los dos scripts llamados check_pinning_library.py
y find_libraries_pinning.sh. Se utilizan para obtener información acerca de las 
bibleotecas que utilizan las aplicaciones Android para la fijación de certificados.

###
El fichero trafficAll.py se emplea para poder ejecutar varias APKs sin tener que
ejecutarlas de una en una. Es necesario que las APKs se situen en un directorio 
llamado apks y además, solamente funcionará para APKs simples.

###
El script trafficBundle.py se utiliza para poder ejecutar aplicaciones bundle. Antes de 
lanzar este script hay que instalar la aplicación de manera manual utilizando por ejemplo
la herramienta adb.

###
El fichero Java Script pinning_casesAndrea.js incluye todos los casos que permiten romper
la fijación de certificados para las bibliotecas indicadas en la memoria y en el propio
documento. Este fichero debe pasarse a la herramienta de instrumentación dinámica Frida.
