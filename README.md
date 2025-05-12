# Chronique

Chronique is a blog platform with a "newspaper theme" design, developed using the MERN stack. It provides a sleek and elegant experience for creating and reading articles.

![Chronique Homepage 1](https://res.cloudinary.com/dv48ogvly/image/upload/v1745346319/chroniqueHome1.png)
![Chronique Homepage 2](https://res.cloudinary.com/dv48ogvly/image/upload/v1745413889/chroniqueHome3.png)

## Installation

Below are the steps to set up the **Chronique** project locally:

1. Clone the repo to your local machine:

```
git clone https://github.com/Tahaldr/Chronique.git
```

2.  Navigate to the project folder and install the backend dependencies:

```
cd Chronique
npm install
```

3. Navigate to the client directory and install the frontend dependencies:

```
cd client && npm install
```

## Usage

To run the project locally:

1. Start the backend server:

```
npm run dev
```

2. In a separate terminal, navigate to the client directory and start the frontend:

```
cd client && npm run dev
```

3. Configure your environment variables
   Create a .env file in the root of your project and add the following configuration, replacing the values with your own credentials:

```
PORT=5000

MONGO_URI= <your_mongo_url>

ACCESS_TOKEN_SECRET= <your_access_token_secret>
REFRESH_TOKEN_SECRET= <your_refresh_token_secret>

CLOUDINARY_CLOUD_NAME= <your_cloudinary_cloud_name>
CLOUDINARY_API_KEY= <your_cloudinary_api_key>
CLOUDINARY_API_SECRET= <your_cloudinary_api_secret>

UPSTASH_REDIS_URL= <your_redis_url>

CLIENT_URL= http://localhost:5173
NODE_ENV= development
```

## Built With

- [![React][React.js]][React-url]
- [![Node.js][Node.js]][Node-url]
- [![Express.js][Express.js]][Express-url]
- [![MongoDB][MongoDB.com]][MongoDB-url]
- [![Tailwind CSS][TailwindCSS.com]][Tailwind-url]

[React.js]: https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB.com]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[TailwindCSS.com]: https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/

## License

MIT license

## Contact

- [![Instagram][Instagram.com]][Instagram-url]
- [![LinkedIn][LinkedIn.com]][LinkedIn-url]
- [![Email][Email.com]][Email-url]

[Instagram.com]: https://img.shields.io/badge/Instagram-EE5E5E?style=for-the-badge&logo=instagram&logoColor=white
[Instagram-url]: https://www.instagram.com/tahadoes_design/
[LinkedIn.com]: https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white
[LinkedIn-url]: https://www.linkedin.com/in/taha-nait-eddouch-504a96296/
[Email.com]: https://img.shields.io/badge/Email-333333?style=for-the-badge&logo=gmail&logoColor=white
[Email-url]: mailto:tahanaitdo@gmail.com
