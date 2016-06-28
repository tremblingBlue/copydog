/**
 * Created by simplemx on 16-6-28.
 */
var componentTypeList = [
  {
    type: 'title',
    name: '标题',
    icon: 'icon-cog'
  },
  {
    type: 'itemList',
    name: '列表',
    icon: 'icon-sitemap'
  }
];

var module = angular.module('app', []);
// page component
module.directive('appTemplateConfig', function() {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      templateData: '=?'
    },
    controller: templateConfigController,
    template: '{{templateData|json}}'
  };
  return config;
});

function templateConfigController($scope) {
  $scope.componentTypeList = componentTypeList;
  if (!$scope.templateData) {
    $scope.templateData = [];
  }
  $scope.addComponent = addComponent;
  $scope.$watch('currentComponentData', componentSelectionChange);

  function addComponent(type) {
    var componentData = {
      type: type,
      data: {}
    };
    $scope.templateData.push(componentData);
    $scope.currentComponentData = componentData;
  }

  function componentSelectionChange() {
    if ($scope.currentDomainChange) {

    }
  }
}

//------- compnoents

// dynamic config properties componet
module.directive('appConfig', function($compile) {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      tempalteData: '='
    },
    template: '=',
    link: linkFunc
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
    $scope.$watch('templateData', templateDataChange);

    function templateDataChange() {
      if ($scope.templateData) {
        if ($scope.currentElement) {
          $scope.currentElement.detach();
        }
        var template = getTemplate();
        $scope.currentElement = $(template);
        $element.append($scope.currentElement);
        $compile($scope.currentElement)($scope);
      }
    }

    function getTemplate() {
      if ($scope.templateData) {
        var tag = getTemplateTag($scope.templateData.type);
        return '<' + tag + ' data="templateData.data"></' + tag + '>';
      } else {
        // no selection
        return '<h3>there is no selection</h3>';
      }
    }

    // type: itemList => component name is appItemList , and component template is <app-item-list>
    function getTemplateTag(type) {
      return 'app-' + $.map(type.split(/(?=[A-Z])/), function(value) {
        return value.toLowerCase();
      }).join('-');
    }
  }
});

// device component
module.directive('appDevice', function() {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      templateData: '='
    },
    template: '',
    link: linkFunc
  };
  return config;

  function  linkFunc($scope, $element, $attrs) {

  }
});

// config title component
module.directive('appTitle', function() {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      data: '='
    },
    linkFunc: linkFunc,
    template: '<input type="text" ng-model="editTitle"/>'
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
    $scope.save = function() {
      $scope.data.title = $scope.editTitle;
    };
    $scope.reset = function() {
      $scope.editTitle = $scope.data.title;
    };
    $scope.reset();
  }
});


