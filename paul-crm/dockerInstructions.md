1. Clone the repository
    a - create a new empty folder
    b - open the folder in vs code
    c - open a terminal session and enter the following command; git clone https://github.com/SwiftPayments/web-portal.git

2. Navigate to paul-crm directory in the terminal using; cd paul-crm

3. Enter the following command in the terminal to build the docker image (this may take a few minutes);
    docker build -f paul-crm -t my-app .

4. Run the docker image; 
    docker run -p 3000:3000 my-app

5. Open your browser and enter the following url;
    localhost:3000/

6. To close the server press ctrl-c three times in quick succession.

7. To stop the running container;
    a - type; docker ps (to get the container id).  Copy the container ID
    b - type docker stop <containerId>  