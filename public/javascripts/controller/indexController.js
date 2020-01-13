app.controller("indexController", [
  "$scope",
  "indexFactory",
  ($scope, indexFactory) => {
    $scope.messages = [  ];
    $scope.players={};
    $scope.init = () => {
      const username = prompt("Please enter username");

      if (username) {
        initSocket(username);
      } else {
        return false;
      }
    };
    function initSocket(username) {
      const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
      };
      indexFactory
        .connectSocket("http://localhost:3000", connectionOptions)
        .then(socket => {
          socket.emit("newUser", { username });

          socket.on('initPlayers',(players)=>{
              console.log(players);
              $scope.players=players;
              $scope.$apply();
          })

          socket.on('newUser',(data)=>{
              const messageData={
                  type:{
                      code:0,
                      message:1
                  },//info
                  username:data.username
              };
              $scope.messages.push(messageData);

              $scope.$apply();
          });
          socket.on('disUser',(data)=>{
            const messageData={
                type:{
                    code:0,
                    message:0
                },//info
                username:data.username
            };
              console.log(data);
              $scope.messages.push(messageData);
              $scope.$apply();
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
]);
