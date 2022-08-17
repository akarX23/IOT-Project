# IOT Project

### Aim - To read the data from the temperature sensor, send it to the server and store the calculated result in the database

## How to run the project

#### The project can be run using `Docker` or `NPM`

## Steps to initialize project:

- Clone the project using `git clone https://github.com/akarX23/IOT-Project.git project_dir`
- Creat a `.env.local` file in the root folder
- Copy the contents of `.env.example` file provided and put the path to the mongodb instance

### Running the project with `Docker`:

- Use the command `docker build -t image_name .` at the root of the folder to build the image
- Use the command `docker run --name container_name -d -p 80:3000 --restart always image_name` to run the container
- Go to `http://localhost:3000` to see the index page

### Running project using `NPM`:

- Run `npm install -f --save` in the root folder
- Run `npm run dev` to run the project in development mode
- Run `npm run build` and then `npm start` to run the project in production mode
