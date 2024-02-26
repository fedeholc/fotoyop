#!/bin/bash

# Obtener el PID del proceso que está utilizando el puerto
PID=$(lsof -t -i:$1)

# Verificar si se encontró un PID
if [ -z "$PID" ]
then
  echo "No se encontró ningún proceso utilizando el puerto $1"
else
  echo "Terminando el proceso $PID que está utilizando el puerto $1"
  kill $PID
fi
