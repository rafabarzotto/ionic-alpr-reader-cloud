angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaCamera, $timeout, $cordovaFileTransfer, $ionicPopup, $http, $ionicLoading) {

  $scope.path = '';

  $scope.showAlert = function(title, errorMsg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: errorMsg
    });
    alertPopup.then(function(res) {
      console.log("Erro: " + res);
    });
  };

  // A confirm dialog
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Alerta',
      template: 'Processar imagem??'
    });
    confirmPopup.then(function(res) {
      if (res) {
        $scope.teste();
      } else {
        console.log('Cancelado!!');
      }
    });
  };

  $scope.teste = function() {
    $http({
      method: 'GET',
      url: 'http://192.168.0.100:3000/check_plate'
    }).then(function successCallback(response) {
      $ionicPopup.alert({
        title: 'Resposta!',
        template: 'Placa: ' + response.data.results[0].plate + '</br>' +
          'Confidencia: ' + response.data.results[0].confidence + '</br>' +
          'Tempo: ' + response.data.results[0].processing_time_ms
      });
    }, function errorCallback(response) {
        $scope.showAlert('Alerta', 'Erro ao processar imagem!');
    });
  };

  $scope.takePhoto = function() {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // An error occured. Show a message to the user
      $scope.showAlert("Error: " + err.statusText, err.data.error.message);
    });
  }

  $scope.choosePhoto = function() {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imagePath) {
      $scope.path = imagePath;
      $scope.imgURI = imagePath;
    }, function(err) {
      $scope.showAlert('Alerta', 'Ação Canceleda');
    });
  }

  $scope.take = function() {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      targetWidth: 300,
      targetHeight: 300,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imagePath) {
      $scope.path = imagePath;
      $scope.imgURI = imagePath;
    }, function(error) {
      $scope.showAlert('Alerta', 'Ação Cancelada');
    });
  }

  $scope.uploadFiles = function() {
    var server = "http://192.168.0.100:3000/upload";
    var filePath = $scope.path;
    var trustHosts = true;
    var options = {};

    $ionicLoading.show({
      template: 'Aguarde... <ion-spinner icon="spiral"></ion-spinner>'
    });

    $cordovaFileTransfer.upload(server, filePath, options)
      .then(function(result) {
        // Success!
        $ionicLoading.hide();
        $scope.teste();
      }, function(err) {
        // Error
        $ionicLoading.hide();
        $scope.showAlert('Alerta', 'Upload Erro!');
      }, function(progress) {
        $ionicLoading.hide();
        // constant progress updates
      });

  }

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});