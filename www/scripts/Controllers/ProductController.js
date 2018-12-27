angular.module('MyApp').controller('ProductController', function ($scope,$http,$route,$location,$window,$timeout) {
 
  
  M.AutoInit();

$scope.BrandsList = [{id:1,name:'brand 1',description:'n.a'},{id:2,name:'brand 2',description:'n.a'}];


function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#imgpanel').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

$("#imgInp").change(function(){
  readURL(this);
});

$scope.clear = function () {
  $("#imgInp").val(null);
  document.getElementById("imgpanel").src = '';
};

});