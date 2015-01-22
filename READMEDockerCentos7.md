En Centos7 (la imagen TSR del laboratorio) es preciso instalar una versión más
nueva de docker (la 1.3.x)

En este directorio se puede ver tal version.

Para instalar, hay que ejecutar las siguientes instrucciones como administrador

sudo systemctl stop docker
sudo cp docker /usr/bin/docker
sudo systemctl start docker

----------------
On Centos7 (the TSR linux image you can find in the lab machines) you need to install a
version of dockeri (1.3.x)  newer than the onw preinstalled.

Within the present directory you can find such a version.

To install, you must run the following instructions as root.

sudo systemctl stop docker
sudo cp docker /usr/bin/docker
sudo systemctl start docker

