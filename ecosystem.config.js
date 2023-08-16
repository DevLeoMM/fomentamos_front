module.exports = {
  apps: [
    {
      name: 'fomentamos_front',
      script: './frontserver.js', 
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
