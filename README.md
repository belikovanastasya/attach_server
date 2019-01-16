Installation
Clone repo git clone https://github.com/belikovanastasya/attach_server.git
Go to project folder and make npm i
Run npm start to start server. Server is available on http://localhost:3000/
Check URL http://localhost:8086 you should see greeting text (aka 'Server is up and running on port number 3000')
In case you need to change port number go to app/app.js and find line with code const PORT = 3000;. Replace 8086 with required number

User API

login:

/api/users/login post { email, password } - by default there is one user in the system with  credentials. On success returns object with user fields {...} On error returns 401 error 'Password or email wrong' or "User not found';

create new user:

/api/users/register post { firstname, lastname, email, password };

update existing user:
/api/users/update put { firstname, lastname };

/api/users/checkuser get - if user is authenticated, return object with user {...}, in other case - 404 error { error: "User is not authenticated"}

/api/users/user_works - to get user works for authenticated users