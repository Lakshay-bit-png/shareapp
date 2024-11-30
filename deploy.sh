echo "switching to main"
git checkout master

echo "Building app"
npm run build

echo "Deploying Files to server"
scp -i ../../Downloads/Access-Lakshay.pem -r build/* ec2-user@172.31.12.213:/var/www/react.app


echo "Done"