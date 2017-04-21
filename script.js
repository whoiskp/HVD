// Code goes here
var app = angular.module('app', []);

app.factory('recognizeService', function($http) {
    return {
        recognize: function(imgLink) {
            var url = 'https://wt-318355bf902736e11e4fc89258873695-0.run.webtask.io/idol-recognize';
            return $http({
                method: 'POST',
                url,
                data: {
                    url: imgLink
                }
            });
        }
    }
});

app.factory('getListIdol', function($http) {
    return {
        listIdols: function() {
            var url = 'https://wt-318355bf902736e11e4fc89258873695-0.run.webtask.io/idol-recognize/getListIdol';
            return $http({
                method: 'GET',
                url
            });
        }
    }
});

app.controller('mainCtrl', function($scope, recognizeService, getListIdol) {
    $scope.isLoading = false;

    $scope.$watch('imageLink', function(oldValue, newValue) {
        $scope.faces = [];
        $scope.faceDisplay = [];
    });

    // Gọi hàm này khi người dùng click button "Nhận diện"
    $scope.recognize = function() {
        if ($scope.isLoading)
            return;

        $scope.isLoading = true;
        // Gọi hàm recognize của service
        recognizeService.recognize($scope.imageLink).then(result => {
            $scope.faces = result.data;

            // Dựa vào kết quả trả về để set style động cho class idol-face
            $scope.faceDisplay = result.data.map(rs => {
                return {
                    style: {
                        top: rs.face.top + 'px',
                        left: rs.face.left + 'px',
                        width: rs.face.width + 'px',
                        height: rs.face.height + 'px'
                    },
                    name: rs.idol.name
                }
            });
            $scope.isLoading = false;
        });
    }

    getListIdol.listIdols().then(result => {
        $scope.idols = result.data.map(rs => {
            return rs.name
        });
        $scope.testImages = result.data.map(rs => {
            return rs.userData.urlImg
        });
    });
});
