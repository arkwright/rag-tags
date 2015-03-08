var Singleton = {
singletonMethodNoSpace:function(){
  // method
},
  singletonIndentedMethod:function(){
    // method
  },
  singletonIndentedMethodBeforeColonSpace :function(){
    // method
  },
  singletonIndentedMethodAfterColonSpace : function(){
    // method
  },
  singletonIndentedMethodBeforeParensSpace : function (){
    // method
  },
  singletonIndentedMethodAfterParensSpace : function () {
    // method
  },
  singletonIndentedMethodWithParam : function (param) {
    // method
  },
  singletonIndentedMethodWithMultipleParams : function (param1, param2, param3) {
    // method
  },
  singletonMethodWithNestedCallback: function() {
    jQuery.ajax('someurl.com', {
      success: function doNotMatch1() {
        // This function should not be matched by the tagging system.
      }
    });
  }
};

(function(){
  var IndentedSingleton = {
    indentedSingletonMethod: function(){
    }
  }
})();

jQuery.ajax('someurl.com', {
  success: function doNotMatch2() {
    // This function should not be matched by the tagging system.
  }
});
