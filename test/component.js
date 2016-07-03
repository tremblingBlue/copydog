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
    name: '商品列表',
    icon: 'icon-th-large'
  },
  {
    type: 'search',
    name: '搜索框',
    icon: 'icon-search',
    noConfig: true
  },
  {
    type: 'imageLink',
    name: '图片链接',
    icon: 'icon-picture'
  },
  {
    type: 'banner',
    name: 'Banner',
    icon: 'icon-picture'
  },
  {
    type: 'categoryList',
    name: '分类列表',
    icon: 'icon-th-large'
  }
];
var getType = function (type) {
  var result;
  $.each(componentTypeList, function (index, each) {
    if (each.type === type) {
      result = each;
      return false;
    }
  });
  return result;
};

var module = angular.module('app', []);
// page component
module.directive('appTemplateConfig', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      templateData: '=?'
    },
    controller: templateConfigController,
    templateUrl: 'templateConfig.html'
  };
  return config;
});

function templateConfigController($scope) {
  $scope.componentTypeList = componentTypeList;
  if (!$scope.templateData) {
    $scope.templateData = [];
  }
  $scope.config = {
    templateData: $scope.templateData
  };
  $scope.addComponent = addComponent;

  function addComponent(type) {
    var componentData = {
      type: type.type,
      data: {}
    };
    $scope.config.templateData.push(componentData);
    $scope.config.currentComponent = componentData;
  }
}

//------- compnoents

// dynamic config properties componet
module.directive('appConfig', function ($compile) {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      componentData: '='
    },
    template: '<div></div>',
    link: linkFunc
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
    $scope.$watch('componentData', templateDataChange);

    function templateDataChange() {
      $element.empty();
      if ($scope.componentData) {
        var type = getType($scope.componentData.type);
        if (!type.noConfig) {
          var template = getTemplate();
          $scope.currentElement = $(template);
          $element.append($scope.currentElement);
          $compile($scope.currentElement)($scope);
        } else {
          $element.append("<p>您选择的组件无需配置</p>")
        }
      }
    }

    function getTemplate() {
      if ($scope.componentData) {
        var tag = getTemplateTag($scope.componentData.type);
        return '<' + tag + ' data="componentData.data"></' + tag + '>';
      } else {
        // no selection
        return '<h3>there is no selection</h3>';
      }
    }

    // type: itemList => component name is appItemList , and component template is <app-item-list>
    function getTemplateTag(type) {
      return 'app-' + $.map(type.split(/(?=[A-Z])/), function (value) {
          return value.toLowerCase();
        }).join('-') + '-config';
    }
  }
})
;

// device panel component
module.directive('appDevice', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      config: '='
    },
    templateUrl: 'appDevice.html',
    link: linkFunc
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
    $scope.selectComponent = selectComponent;
    $scope.moveUp = moveUp;
    $scope.moveDown = moveDown;
    $scope.remove = remove;

    function selectComponent(data) {
      $scope.config.currentComponent = data;
    }

    function moveUp(component) {
      var list = $scope.config.templateData;
      var index = list.indexOf(component);
      if (index > -1) {
        list.splice(index, 1);
        if (index == 0) {
          list.push(component)
        } else {
          list.splice(index - 1, 0, component);
        }
      }
    }

    function moveDown(component) {
      var list = $scope.config.templateData;
      var index = list.indexOf(component);
      if (index > -1) {
        if (index == list.length - 1) {
          list.splice(index, 1);
          list.unshift(component);
        } else {
          list.splice(index, 1);
          list.splice(index + 1, 0, component);
        }
      }
    }

    function remove(component) {
      var list = $scope.config.templateData;
      list.splice(list.indexOf(component), 1);
    }
  }
});

// deivce item component
module.directive('appDeviceComponent', function ($compile) {
  var config = {
    restrict: 'E',
    scope: {
      component: '=',
      selected: '=',
      moveUp: '=',
      moveDown: '=',
      remove: '='
    },
    templateUrl: 'appDeviceComponent.html',
    link: linkFunc
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
    var componentElement = $($element[0].querySelector('.span12'));
    componentElement.empty();
    var template = getTemplate();
    template = $(template);
    componentElement.append(template);
    $compile(template)($scope);

    function getTemplate() {
      if ($scope.component) {
        var tag = getTemplateTag($scope.component.type);
        return '<' + tag + ' component="component"></' + tag + '>';
      } else {
        return '<h3>empty component</h3>';
      }
    }

    // type: itemList => component name is appItemList , and component template is <app-item-list>
    function getTemplateTag(type) {
      return 'app-' + $.map(type.split(/(?=[A-Z])/), function (value) {
          return value.toLowerCase();
        }).join('-');
    }
  }
});

// title component
module.directive('appTitle', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'component/appTitle.html'
  };
  return config;

});

// config title component
module.directive('appTitleConfig', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      data: '='
    },
    linkFunc: linkFunc,
    templateUrl: 'config/appTitleConfig.html'
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
    $scope.save = function () {
      $scope.data.title = $scope.editTitle;
    };
    $scope.reset = function () {
      $scope.editTitle = $scope.data.title;
    };
    $scope.reset();
  }
});

// item list component
module.directive('appItemList', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'component/appItemList.html'
  };
  return config;

});

// item list config compoent
module.directive('appItemListConfig', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      data: '='
    },
    linkFunc: linkFunc,
    templateUrl: 'config/appItemListConfig.html'
  };
  return config;

  function linkFunc($scope, $element, $attrs) {
  }
});

// search component
module.directive('appSearch', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'component/appSearch.html'
  };
  return config;

});
// image link component
module.directive('appImageLink', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'component/appImageLink.html'
  };
  return config;

});
module.directive('appImageLinkConfig', function () {
  var config = {
    replace: true,
    restrict: 'E',
    scope: {
      component: '='
    },
    templateUrl: 'config/appImageLinkConfig.html'
  };
  return config;
});

