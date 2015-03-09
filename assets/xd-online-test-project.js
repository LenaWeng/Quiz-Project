define('xd-online-test-project/app', ['exports', 'ember', 'xd-online-test-project/config/environment', 'ember/resolver', 'ember/load-initializers'], function (exports, Ember, config, Resolver, loadInitializers) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

  Ember['default'].RadioButton = Ember['default'].Component.extend({
    tagName: "input",
    type: "radio",
    attributeBindings: ["name", "type", "value", "id", "checked:checked"]
  });

  Ember['default'].TextField.reopen({
    attributeBindings: ["data-rule-required", "data-rule-alpha", "data-msg-required", "data-rule-phoneUS", "data-rule-email", "data-rule-equalto", "data-rule-zipcodeUS", "name", "data-rule-showError"]
  });

  Ember['default'].BeginTest = Ember['default'].View.extend({
    classNames: ["submit"],
    tagName: "button",
    click: function () {
      $("#questionnaire_form").validate({
        submitHandler: function () {
          $("#my-info").slideUp("slow");
          $("#test-questions").slideDown("slow");

        }
      });
    }
  });

  Ember['default'].Question = Ember['default'].View.extend({
    didInsertElement: function () {
      $.fn.extend({
        limiter: function (limit, elem) {
          var setCount = function (src, elem) {
            var chars = src.value.length;
            if (chars > limit) {
              src.value = src.value.substr(0, limit);
              chars = limit;
            }
            elem.html(limit - chars);
          };

          $(this).on("keyup focus show", function () {
            setCount(this, elem);
          });
          setCount($(this)[0], elem);
        }
      });
      var elem = $(".chars span");
      $("textarea").limiter(255, elem);
      $("input").limiter(255, elem);
    },
    click: function () {
      // $('.question li a').on('click',function() {
      $(".question li a").removeClass("active");
      var a = this.elementId;
      var classname = $("#" + a + " > a").attr("class");
      $("." + classname).addClass("active");
      var b = classname;
      $(".question-info").addClass("hidden");
      $("#" + b).removeClass("hidden").find("textarea").focus();


      // });
    }
  });


  Ember['default'].Submit = Ember['default'].View.extend({
    classNames: ["submit"],
    tagName: "button",
    click: function () {
      $("#submit").prop("disabled", true);
      var formData = $("#questionnaire_form").serializeArray();
      //console.log(formData);
      $.post("send_mail.php", formData).done(function (data) {
        //console.log("post succeeded!");
        // redirect to thank you page here
        $("#question-page").addClass("hidden");
        $("#thank-you").removeClass("hidden");
      }).fail(function (data) {}).always(function (data) {});
    }
  });

  Ember['default'].View.reopen({
    parentViewDidChange: function () {
      $(document).ready(function () {


        $("#terms").click(function () {
          $("#termsModal").modal({
            keyboard: true,
            show: true,
            backdrop: true
          });
        });


        //             $(window).bind('beforeunload',function(){
        //                // window.location.replace("http://0.0.0.0:8000/");
        //                //return 'Once you refresh the page, your test will be invalidated.';
        // swal("Here's a message!")

        //            });



        $("#btnStart").click(function () {
          if ($("#chkAgree").is(":checked")) {
            return true;
          } else {
            $(".checkbox").velocity("callout.shake", 750);
            $(".checkbox").addClass("error");
            return false;
          }
        });

        $(".checkbox").change(function () {
          if ($("input#chkAgree").prop("checked")) {
            $(".checkbox").removeClass("error");
          }
        });



        //    //Textarea char limit




      });
    }

  });
  /// console.log("failed to post");

});
define('xd-online-test-project/initializers/export-application-global', ['exports', 'ember', 'xd-online-test-project/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('xd-online-test-project/router', ['exports', 'ember', 'xd-online-test-project/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  // Router.map(function() {
  // });

  // export default Router;

  //var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

  Router.map(function () {
    this.resource("questions");
    this.resource("thank-you");
    //this.route('helper-test');
    // this.resource('posts', function() {
    //   this.route('new');
    // });
  });

  // App.Router.map(function () {
  //     this.resource('questions', function () {
  //         this.resource('question', { path: ':question_id' });
  //     });
  // });


  exports['default'] = Router;

});
define('xd-online-test-project/routes/questions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function () {
      return {
        css: [{
          id: "Question-7",
          question_name: "questions[question_7]",
          answer_name: "answers[answer_7]",
          display_name: "CSS preprocessor",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Have you used a CSS preprocessor before? Which do you prefer, and why?",
          answer: ""
        }, {
          id: "Question-8",
          question_name: "questions[question_8]",
          answer_name: "answers[answer_8]",
          display_name: "CSS Positioning",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "List 3 types of CSS positioning and how they work, and explain the differences.",
          answer: ""
        }, {
          id: "Question-9",
          question_name: "questions[question_9]",
          answer_name: "answers[answer_9]",
          display_name: "Parent child position",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "You would like a container div that's of fluid width, and to nest another div inside that has: a) padding; b) 100% width (edge-to-edge with the container). What is the issue and how is it typically resolved?",
          answer: ""
        }, {
          id: "Question-11",
          question_name: "questions[question_11]",
          answer_name: "answers[answer_11]",
          display_name: "Ids verses Classes",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "List one advantage of using IDs over classes. List one disadvantage.",
          answer: ""
        }, {
          id: "Question-12",
          question_name: "questions[question_12]",
          answer_name: "answers[answer_12]",
          display_name: "Sass variables",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "When targeting media queries that are defined by variables using SASS ($width-small: 400px;), what is the solution for increasing the breakpoint by one value?",
          answer: ""
        }, {
          id: "Question-13",
          question_name: "questions[question_13]",
          answer_name: "answers[answer_13]",
          display_name: "CSS Selector",
          textarea: null,
          textfield: "yes",
          radio: null,
          options: "",
          title: "CSS",
          body: "What does the \">\" (greater-than sign) CSS selector mean?",
          answer: ""
        }, {
          id: "Question-14",
          question_name: "questions[question_14]",
          answer_name: "answers[answer_14]",
          display_name: "Media Queries",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Provide an example of a media query.",
          answer: ""
        }, {
          id: "Question-15",
          question_name: "questions[question_15]",
          answer_name: "answers[answer_15]",
          display_name: "Box Model",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Explain the CSS box model.",
          answer: ""
        }, {
          id: "Question-16",
          question_name: "questions[question_16]",
          answer_name: "answers[answer_16]",
          display_name: "Grid Systems",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Briefly explain the advantages and disadvantages of using a grid system.",
          answer: ""
        }, {
          id: "Question-17",
          question_name: "questions[question_17]",
          answer_name: "answers[answer_17]",
          display_name: "The magic of IE",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "How would you handle being given the conflicting business requirements to A) support versions of Internet Explorer down to IE8; B) use features that Internet Explorer 8 does not support (gradients, rounded corners, transitions, etc)?",
          answer: ""
        }, {
          id: "Question-18",
          question_name: "questions[question_18]",
          answer_name: "answers[answer_18]",
          display_name: "Pseudo...what",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "What are CSS Pseudo-classes?",
          answer: ""
        }, {
          id: "Question-19",
          question_name: "questions[question_19]",
          answer_name: "answers[answer_19]",
          display_name: "Rotating with CSS",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Write CSS to make an object rotate (for a webkit browser).",
          answer: ""
        }],
        js: [{
          id: "Question-20",
          question_name: "questions[question_20]",
          answer_name: "answers[answer_20]",
          display_name: "JavaScript",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "What's your experience with object-oriented JavaScript?",
          answer: ""
        }, {
          id: "Question-21",
          question_name: "questions[question_21]",
          answer_name: "answers[answer_21]",
          display_name: "JavaScript + jQuery",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "How would you avoid conflicts between jQuery and Prototype JavaScript libraries?",
          answer: ""
        }, {
          id: "Question-22",
          question_name: "questions[question_22]",
          answer_name: "answers[answer_22]",
          display_name: "IE7 and child selectors",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "How would you select the last item in a list (must work in IE7)?",
          answer: ""
        }, {
          id: "Question-23",
          question_name: "questions[question_23]",
          answer_name: "answers[answer_23]",
          display_name: "From this to that",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Using Javascript find the value of an element that can be used (and reused) to be output to another element.",
          answer: ""
        }, {
          id: "Question-25",
          question_name: "questions[question_25]",
          answer_name: "answers[answer_25]",
          display_name: "Truthy & JavaScript",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Explain the term truthy as it relates to comparisons in JavaScript.",
          answer: ""
        }, {
          id: "Question-26",
          question_name: "questions[question_26]",
          answer_name: "answers[answer_26]",
          display_name: "Console outputs",
          textarea: null,
          textfield: "yes",
          radio: null,
          options: "",
          title: "JavaScript",
          body: "What will be the output (in the console)  from each of these statements: if(myvar === \"not defined\"){console.log(\"hello\")}, if(myvar == \"not defined\"){console.log(\"hello\")}, if(myvar = \"not defined\"){console.log(\"hello\")}.",
          answer: ""
        }, {
          id: "Question-27",
          question_name: "questions[question_27]",
          answer_name: "answers[answer_27]",
          display_name: "Catch me if you can",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Show me a basic JavaScript try catch block that all JavaScript functions should have.",
          answer: ""
        }],
        html: [{
          id: "Question-1",
          question_name: "questions[question_1]",
          answer_name: "answers[answer_1]",
          display_name: "HTML5 tag semantics",
          textarea: "yes",
          radio: null,
          textfield: null,
          options: "",
          title: "HTML",
          body: "What is the benefit of using the new HTML5 tag semantics?",
          answer: ""
        }, {
          id: "Question-2",
          question_name: "questions[question_2]",
          answer_name: "answers[answer_2]",
          display_name: "Frameworks",
          textarea: "yes",
          radio: null,
          textfield: null,
          options: "",
          title: "HTML",
          body: "Which HTML/CSS framework do you use (if any) and why (or why not)?",
          answer: ""
        }, {
          id: "Question-6",
          question_name: "questions[question_6]",
          answer_name: "answers[answer_6]",
          display_name: "Input fields",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "Create an input field that restricts the number of characters inside it to 10.",
          answer: ""
        }, {
          id: "Question-3",
          question_name: "questions[question_3]",
          answer_name: "answers[answer_3]",
          display_name: "Widgets",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "How would you create a widget that would fit in a 250px wide area as well as a 400px area?",
          answer: ""
        }, {
          id: "Question-4",
          question_name: "questions[question_4]",
          answer_name: "answers[answer_4]",
          display_name: "Local Storage",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "What is the lifetime of local storage?",
          answer: ""
        }, {
          id: "Question-28",
          question_name: "questions[question_28]",
          answer_name: "answers[answer_28]",
          display_name: "IE8 & responsive",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "Design/Performance/UX",
          body: "How would you deal with a browser that does not support HTML5/CSS3 (such as IE8) handle a responsive web page?",
          answer: ""
        }, {
          id: "Question-29",
          question_name: "questions[question_29]",
          answer_name: "answers[answer_29]",
          display_name: "Site performance",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "Design/Performance/UX",
          body: "What are a few ways you can improve a site's performance (load times)?",
          answer: ""
        }]
      };


    },
    actions: {
      redirect: function () {
        this.transitionTo("thank-you");
      }
    }
  });

});
define('xd-online-test-project/templates/_logo', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"row\">\n        <div class=\"col-xs-12\">\n            <img src=\"assets/logo.png\" alt=\"Perficient XD\"/>\n        </div>\n    </div>\n");
    
  });

});
define('xd-online-test-project/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/component-test', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<h1>Hello</h1>\n");
    
  });

});
define('xd-online-test-project/templates/components/pretty-color', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("Pretty Color: ");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/components/terms-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<!-- Modal: Terms and Conditions -->\n        <!-- Modal -->\n        <div class=\"modal fade\" id=\"termsModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" data-backdrop=\"static\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"><span class=\"glyphicon glyphicon-remove-circle\"></span></button>\n                        <p class=\"title\" style=\"text-align:center;\">Perficient Terms and Conditions</p>\n                        <p class=\"title\" style=\"text-align:center;\">Before you taking the programming test please read the terms and conditions</p>\n                    </div>\n                    <div class=\"modal-body\">\n                        <strong>Term #1 - Transfer of your 1st born to Perficient</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                        <strong>Term #2 - Complaints about having to transfer your 1st born to Perficient</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                        <strong>Term #3 - We already told you we're taking your 1st born so shut up already. You want this job don't you?</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                    </div>\n                </div><!-- /.modal-content -->\n            </div><!-- /.modal-dialog -->\n        </div><!-- /.modal -->\n");
    
  });

});
define('xd-online-test-project/templates/error', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<h1>Sorry, Something went wrong</h1>\n");
    stack1 = helpers._triageMustache.call(depth0, "message", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<pre>\n");
    stack1 = helpers._triageMustache.call(depth0, "stack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</pre>\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/helper-test', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h3>My name is ");
    data.buffer.push(escapeExpression((helper = helpers['reverse-word'] || (depth0 && depth0['reverse-word']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "name", options) : helperMissing.call(depth0, "reverse-word", "name", options))));
    data.buffer.push(".</h3>\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n                            <button id=\"btnStart\" class=\"btn-lg btn-primary btn-xd-submit\">Start</button>\n                            ");
    }

    data.buffer.push(" <!-- Login -->\n        <div class=\"wrap\">\n            <div class=\"main\">\n                <div class=\"row welcome-text text-center\">\n                    <!--<img src=\"assets/logo.png\" alt=\"Perficient XD\"/>-->\n                    <h3>Skills Assessment Test</h3>\n                    <p>For this test you will have a set amount of time to complete a number of questions.</p>\n                    <p>The time for the test will start when you click the \"Start\" button below.</p>\n                    <p>Good Luck!</p>\n                </div>\n                \n                    <div class=\"form-group\">\n                        <div class=\"checkbox\">\n                            <label>\n                                <input id=\"chkAgree\" type=\"checkbox\"/> I accept the <a href=\"#\" id=\"terms\">Terms and Conditions</a>\n                            </label>\n                        </div>\n                        <div class=\"row\">\n                            ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "questions", options) : helperMissing.call(depth0, "link-to", "questions", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </div>\n                    </div>\n                \n            </div>\n        </div>\n\n        <!-- Modal: Terms and Conditions -->\n        <!-- Modal -->\n        <div class=\"modal fade\" id=\"termsModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" data-backdrop=\"static\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"><span class=\"glyphicon glyphicon-remove-circle\"></span></button>\n                        <p class=\"title\" style=\"text-align:center;\">Perficient Terms and Conditions</p>\n                        <p class=\"title\" style=\"text-align:center;\">Before you taking the programming test please read the terms and conditions</p>\n                    </div>\n                    <div class=\"modal-body\">\n                        <strong>Term #1 - Transfer of your 1st born to Perficient</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                        <strong>Term #2 - Complaints about having to transfer your 1st born to Perficient</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                        <strong>Term #3 - We already told you we're taking your 1st born so shut up already. You want this job don't you?</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                    </div>\n                </div><!-- /.modal-content -->\n            </div><!-- /.modal-dialog -->\n        </div><!-- /.modal -->\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<h1>Loading...</h1>\n");
    
  });

});
define('xd-online-test-project/templates/question', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                ");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'value': ("answer"),
      'name': ("answer_name"),
      'maxlength': ("140"),
      'class': ("form-control"),
      'data-limit': ("40")
    },hashTypes:{'value': "ID",'name': "ID",'maxlength': "STRING",'class': "STRING",'data-limit': "STRING"},hashContexts:{'value': depth0,'name': depth0,'maxlength': depth0,'class': depth0,'data-limit': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n                <div class=\"chars\">Characters remaining: <span></span></div>\n            ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                ");
    stack1 = helpers['if'].call(depth0, "textfield", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                \n                ");
    stack1 = helpers['if'].call(depth0, "radio", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'name': ("answer_name"),
      'value': ("answer"),
      'class': ("form-control"),
      'maxlength': ("100")
    },hashTypes:{'type': "STRING",'name': "ID",'value': "ID",'class': "STRING",'maxlength': "STRING"},hashContexts:{'type': depth0,'name': depth0,'value': depth0,'class': depth0,'maxlength': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n                    <div class=\"chars\">Characters remaining: <span></span></div>\n                ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                    <div class=\"radio\">\n                        <label>\n                            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("answer_name"),
      'value': ("options.value1"),
      'class': ("radio-class")
    },hashTypes:{'name': "ID",'value': "ID",'class': "STRING"},hashContexts:{'name': depth0,'value': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
    stack1 = helpers._triageMustache.call(depth0, "options.value1", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </label>\n                    </div>\n                    <div class=\"radio\">\n                        <label>\n                            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("answer_name"),
      'value': ("options.value2"),
      'class': ("radio-class")
    },hashTypes:{'name': "ID",'value': "ID",'class': "STRING"},hashContexts:{'name': depth0,'value': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
    stack1 = helpers._triageMustache.call(depth0, "options.value2", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </label>\n                    </div>\n                    <div class=\"radio\">\n                        <label>\n                            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("answer_name"),
      'value': ("options.value3"),
      'class': ("radio-class")
    },hashTypes:{'name': "ID",'value': "ID",'class': "STRING"},hashContexts:{'name': depth0,'value': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
    stack1 = helpers._triageMustache.call(depth0, "options.value3", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </label>\n                    </div>\n                    <div class=\"radio\">\n                        <label>\n                            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("answer_name"),
      'value': ("options.value4"),
      'class': ("radio-class")
    },hashTypes:{'name': "ID",'value': "ID",'class': "STRING"},hashContexts:{'name': depth0,'value': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
    stack1 = helpers._triageMustache.call(depth0, "options.value4", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </label>\n                    </div>\n                    <div class=\"radio\">\n                        <label>\n                            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("answer_name"),
      'value': ("options.value5"),
      'class': ("radio-class")
    },hashTypes:{'name': "ID",'value': "ID",'class': "STRING"},hashContexts:{'name': depth0,'value': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
    stack1 = helpers._triageMustache.call(depth0, "options.value5", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </label>\n                    </div>\n                    <div class=\"radio\">\n                        <label>\n                            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.RadioButton", {hash:{
      'name': ("answer_name"),
      'value': ("options.value6"),
      'class': ("radio-class")
    },hashTypes:{'name': "ID",'value': "ID",'class': "STRING"},hashContexts:{'name': depth0,'value': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
    stack1 = helpers._triageMustache.call(depth0, "options.value6", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </label>\n                    </div>\n       \n                ");
    return buffer;
    }

    data.buffer.push("         <div class=\"row welcome-text\">\n                <div class=\"col-xs-12\">\n                    <h3>");
    stack1 = helpers._triageMustache.call(depth0, "display_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(":</h3>\n                    <p>");
    stack1 = helpers._triageMustache.call(depth0, "body", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n                </div>\n            </div>\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("hidden"),
      'name': ("question_name"),
      'value': ("body")
    },hashTypes:{'type': "STRING",'name': "ID",'value': "ID"},hashContexts:{'type': depth0,'name': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n            ");
    stack1 = helpers['if'].call(depth0, "textarea", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/questions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Begin My Test ");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                                                        <li>\n                                                           \n                                                             ");
    stack1 = helpers.view.call(depth0, "Ember.Question", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                                                          \n                                                        </li>\n                                                       ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("<a ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("id")
    },hashTypes:{'class': "ID"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("> ");
    stack1 = helpers._triageMustache.call(depth0, "display_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                                    ");
    stack1 = helpers['if'].call(depth0, "_view.contentIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                                ");
    return buffer;
    }
  function program7(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                                        <div class=\"question-info hidden\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'id': ("id")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n                                            ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "question", options) : helperMissing.call(depth0, "partial", "question", options))));
    data.buffer.push("\n                                        </div>\n\n                                    ");
    return buffer;
    }

  function program9(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                                         <div class=\"question-info form-horizontal\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'id': ("id")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n                                            ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "question", options) : helperMissing.call(depth0, "partial", "question", options))));
    data.buffer.push("\n                                        </div>\n                                    ");
    return buffer;
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("Submit All Answers ");
    }

    data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12 col-sm-12 col-xs-12\">\n        <div id=\"question-page\">\n            <form id=\"questionnaire_form\" role=\"form\">\n                    <div id=\"my-info\">\n                        <div class=\"container\">\n                            <div class=\"row\">\n                                <div class=\"col-xs-12 text-center\">\n                                    <h4>Please enter the below information</h4>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"form-group col-xs-offset-4 col-xs-4\">\n                                    <input type=\"text\" placeholder=\"Your Name\" id=\"name\" name=\"name\" class=\"ember-view ember-text-field form-control error\" data-rule-required=\"true\" data-rule-alpha=\"true\" data-msg-required=\"Please enter a valid name\">\n                              </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"form-group col-xs-offset-4 col-xs-4\">\n                                <input type=\"email\" placeholder=\"Your Email Address\" id=\"email\" name=\"email\" class=\"ember-view ember-text-field form-control\" data-rule-required=\"true\" data-msg-required=\"Please enter a valid email address\" data-rule-email=\"true\">\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <div class=\"form-group col-xs-offset-4 col-xs-4\">\n                               \n                               ");
    stack1 = helpers.view.call(depth0, "Ember.BeginTest", {hash:{
      'id': ("begin-my-test")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </div>\n                        </div>\n                    </div>\n                    </div>\n\n                    <div id=\"test-questions\">\n                        <div class=\"container\">\n                            <div class=\"row\">\n                                <div class=\"col-xs-3 col-md-3 leftcol nopad\">\n                                    <div class='questions-title'>Questions</div>\n                                    <nav>\n                                        <div class=\"navbar\">\n                                            <div class=\"navbar-inner\">\n                                                <h4 class=\"category\">HTML5</h4>\n                                                <ol class=\"question\">\n                                                    ");
    stack1 = helpers.each.call(depth0, "model.html", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                                                </ol>\n \n                                                <h4 class=\"category\">CSS</h4>\n                                                <ol class=\"question\">\n                                                    ");
    stack1 = helpers.each.call(depth0, "model.css", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                                                </ol>\n                                               <h4 class=\"category\">JS</h4>\n                                                <ol class=\"question\">\n                                                    ");
    stack1 = helpers.each.call(depth0, "model.js", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                                                </ol>\n                                            </div>\n                                        </div>\n                                    </nav>\n\n                                </div>\n                                <div class=\"col-xs-9 col-md-9\">\n\n                                ");
    stack1 = helpers.each.call(depth0, "model.html", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n                                ");
    stack1 = helpers.each.call(depth0, "model.js", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n                                ");
    stack1 = helpers.each.call(depth0, "model.css", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n                          \n\n                                    <div class=\"pull-right\">\n                                      ");
    stack1 = helpers.view.call(depth0, "Ember.Submit", {hash:{
      'id': ("submit")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n\n                    </div>\n            </form>\n        </div>\n    </div>\n</div>\n\n<div id=\"thank-you\" class=\"hidden\">\n    <div class=\"container\">\n        ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "logo", options) : helperMissing.call(depth0, "partial", "logo", options))));
    data.buffer.push("\n        <div class=\"alert alert-success\" role=\"alert\">\n          Thank you! Your answers have been successfully submitted. We will review and get back to you.\n        </div>\n    </div>\n</div>\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/thank-you', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "logo", options) : helperMissing.call(depth0, "partial", "logo", options))));
    data.buffer.push("\n<div class=\"alert alert-success\" role=\"alert\">\n  Thank you! Your answers have been successfully submitted. We will review and get back to you.\n</div>\n");
    return buffer;
    
  });

});
define('xd-online-test-project/tests/helpers/resolver', ['exports', 'ember/resolver', 'xd-online-test-project/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('xd-online-test-project/tests/helpers/start-app', ['exports', 'ember', 'xd-online-test-project/app', 'xd-online-test-project/router', 'xd-online-test-project/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';

  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
  exports['default'] = startApp;

});
define('xd-online-test-project/tests/test-helper', ['xd-online-test-project/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

	document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

	QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
	var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
	document.getElementById("ember-testing-container").style.visibility = containerVisibility;

});
define('xd-online-test-project/views/global-main', function () {

	'use strict';


	// /* Radio button */
	// Ember.RadioButton = Ember.Component.extend({
	//     tagName : "input",
	//     type : "radio",
	//     attributeBindings : ['name', 'type', 'value', 'id', "checked:checked"]
	// });

	// Ember.TextField.reopen({
	//     attributeBindings: ['data-rule-required', 'data-rule-alpha', 'data-msg-required', 'data-rule-phoneUS', 'data-rule-email', 'data-rule-equalto', 'data-rule-zipcodeUS', 'name', 'data-rule-showError']
	// });

	// Ember.BeginTest = Ember.View.extend({
	//     classNames: ['submit'],
	//     tagName: 'button',
	//     click: function () {
	//         $('#questionnaire_form').validate({
	//             submitHandler: function () {

	//             $('#my-info').slideUp('slow');
	//             $('#test-questions').slideDown('slow');


	//            }
	//        });
	//     }
	// });

	// Ember.Question = Ember.View.extend({
	//     didInsertElement: function() {
	// $.fn.extend( {
	//                limiter: function(limit, elem) {
	//                     $(this).on("keyup focus show", function() {
	//                         setCount(this, elem);
	//                     });
	//                     function setCount(src, elem) {
	//                         var chars = src.value.length;
	//                         if (chars > limit) {
	//                             src.value = src.value.substr(0, limit);
	//                             chars = limit;
	//                         }
	//                         elem.html( limit - chars );
	//                     }
	//                     setCount($(this)[0], elem);
	//                 }
	//             });
	//             var elem = $(".chars span");
	//           $('textarea').limiter(255, elem);
	//           $('input').limiter(255, elem);
	//     },
	//     click: function() {
	//    // $('.question li a').on('click',function() {
	//                 $('.question li a').removeClass('active');
	//                 var a = this.elementId;
	//                 var classname = $('#'+a+' > a').attr('class');
	//                 $('.'+classname).addClass('active');
	//                 var b = classname;
	//                 $('.question-info').addClass('hidden');
	//                 $('#'+b).removeClass('hidden').find('textarea').focus();


	//            // });
	//     }
	// });


	// Ember.Submit = Ember.View.extend({
	//     classNames: ['submit'],
	//     tagName: 'button',
	//     click: function () {
	//         $('#submit').prop('disabled', true);
	//            var formData = $("#questionnaire_form").serializeArray();
	//                 //console.log(formData);
	//                 $.post("send_mail.php", formData)
	//                 .done(function(data){
	//                     //console.log("post succeeded!");
	//                     // redirect to thank you page here
	//                     $('#question-page').addClass('hidden');
	//                     $('#thank-you').removeClass('hidden');
	//                 })
	//                 .fail(function(data){
	//                    /// console.log("failed to post");
	//                 })
	//                 .always(function(data){
	//                 });
	//     }
	// });

	// Ember.View.reopen({
	//     parentViewDidChange: function(){
	//         $(document).ready(function(){


	//             $('#terms').click(function(){
	//                 $('#termsModal').modal({
	//                     keyboard: true,
	//                     show: true,
	//                     backdrop: true
	//                 });
	//             });


	//  //             $(window).bind('beforeunload',function(){
	//  //                // window.location.replace("http://0.0.0.0:8000/");
	//  //                //return 'Once you refresh the page, your test will be invalidated.';
	//  // swal("Here's a message!")

	//  //            });



	//             $('#btnStart').click(function () {

	//                 if ($('#chkAgree').is(':checked')) {
	//                     return true;
	//                 }
	//                 else {
	//                     $('.checkbox').velocity("callout.shake", 750);
	//                     $('.checkbox').addClass('error');
	//                     return false;
	//                 }
	//             });

	//             $('.checkbox').change(function(){
	//                 if ($('input#chkAgree').prop('checked')) {
	//                     $('.checkbox').removeClass('error');
	//                 }
	//             });



	//            //    //Textarea char limit





	//         });

	//     }

	// });

});
/* jshint ignore:start */

define('xd-online-test-project/config/environment', ['ember'], function(Ember) {
  return { 'default': {"modulePrefix":"xd-online-test-project","environment":"development","baseURL":"/","locationType":"hash","EmberENV":{"FEATURES":{}},"APP":{},"contentSecurityPolicyHeader":"Content-Security-Policy-Report-Only","contentSecurityPolicy":{"default-src":"'none'","script-src":"'self' 'unsafe-eval'","font-src":"'self'","connect-src":"'self'","img-src":"'self'","style-src":"'self'","media-src":"'self'"},"exportApplicationGlobal":true}};
});

if (runningTests) {
  require("xd-online-test-project/tests/test-helper");
} else {
  require("xd-online-test-project/app")["default"].create({});
}

/* jshint ignore:end */
//# sourceMappingURL=xd-online-test-project.map