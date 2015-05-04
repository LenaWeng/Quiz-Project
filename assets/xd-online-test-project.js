define('xd-online-test-project/app', ['exports', 'ember', 'xd-online-test-project/config/environment', 'ember/resolver', 'ember/load-initializers'], function (exports, Ember, config, Resolver, loadInitializers) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default'],
    rootElement: "#main-content",
    fingerprint: {
      exclude: ["fonts/"]
    }
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
    classNames: ["submit btn btn-lg btn-default"],
    tagName: "button",
    click: function () {
      $("#questionnaire_form").validate({
        errorPlacement: function (error, element) {
          if (element.attr("name") == "terms") {
            error.insertAfter("#terms");
          } else {
            error.insertAfter(element);
          }
        },
        submitHandler: function () {
          $("#my-info").slideUp("slow");

          $("#test-questions").slideDown("slow");
        }
      });
    }
  });

  Ember['default'].area = Ember['default'].View.extend({
    didInsertElement: function () {
      $(document).ready(function () {
        $("textarea").change(function () {
          var id = $(this).parent().parent().attr("id");
          if ($.trim($("#" + id + " textarea").val()).length < 1) {
            $("." + id).removeClass("question-answered");
          } else {
            $("." + id).addClass("question-answered");
          }
        });
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

          $("textarea").on("keyup focus show", function () {
            setCount(this, elem);
          });

          setCount($(this)[0], elem);
        }
      });
      var elem = $(".chars span");
      $("textarea").limiter(255, elem);
      $("input").limiter(255, elem);
      $(".Question-1").addClass("active");
    },
    click: function () {
      // $('.question li a').on('click',function() {
      $(".question li a").removeClass("active");
      $(".previous").removeAttr("disabled");
      var a = this.elementId;
      var classname = $("#" + a + " > a").attr("class");
      $("." + classname).addClass("active");
      var b = classname.slice(0, 11);
      $(".question-info").addClass("hidden");
      $("#" + b).removeClass("hidden").find("textarea").focus();
      if (b == "Question-26") {
        $(".next").attr("disabled", "true");
        $(".previous").removeAttr("disabled");
      }
      if (b == "Question-1") {
        $(".previous").attr("disabled", "true");
        $(".next").removeAttr("disabled");
      }

      // });
    }
  });


  Ember['default'].Submit = Ember['default'].View.extend({
    classNames: ["submit submit-btn btn btn-primary"],
    tagName: "button",
    click: function () {
      $("#submit").prop("disabled", true);
      $(".next").attr("disabled", "true");
      $(".previous").attr("disabled", "true");
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

  Ember['default'].Previous = Ember['default'].View.extend({
    classNames: ["submit previous btn btn-secondary"],
    tagName: "button",
    didInsertElement: function () {
      $(".previous").attr("disabled", "true");
    },
    click: function () {
      $("textarea").change(function () {
        var id = $(this).parent().parent().attr("id");
        if ($.trim($("#" + id + " textarea").val()).length < 1) {
          $("." + id).removeClass("question-answered");
        } else {
          $("." + id).addClass("question-answered");
        }
      });


      $(".next").removeAttr("disabled");
      $(".question-info").each(function () {
        if (!$(this).hasClass("hidden")) {
          $(this).addClass("hidden");
          $(this).prev().removeClass("hidden");
          var currentId = $(this).attr("id");
          var prevId = $(this).prev().attr("id");
          $("." + currentId).removeClass("active");
          $("." + prevId).addClass("active");
          if ($(this).prev().attr("id") == "Question-1") {
            $(".previous").attr("disabled", "true");
          }
          return false;
        }
      });
    }
  });

  Ember['default'].Next = Ember['default'].View.extend({
    classNames: ["submit next btn btn-secondary"],
    tagName: "button",
    click: function () {
      //if($('.Question-1').hasClass('active')) {
      $(".Question-1").removeClass("active");
      //}
      $("textarea").change(function () {
        var id = $(this).parent().parent().attr("id");
        if ($.trim($("#" + id + " textarea").val()).length < 1) {
          $("." + id).removeClass("question-answered");
        } else {
          $("." + id).addClass("question-answered");
        }
      });

      $(".previous").removeAttr("disabled");
      $(".question-info").each(function () {
        if (!$(this).hasClass("hidden")) {
          $(this).addClass("hidden");
          $(this).next().removeClass("hidden");
          var currentId = $(this).attr("id");
          var nextId = $(this).next().attr("id");
          $("." + currentId).removeClass("active");
          $("." + nextId).addClass("active");
          if (nextId == "Question-26") {
            $(".next").attr("disabled", "true");
          }
          return false;
        }
      });
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

        //if($('#Question-1 textarea').val()) { $('.Question-1').addClass('answered'); }



        //             $(window).bind('beforeunload',function(){
        //                // window.location.replace("http://0.0.0.0:8000/");
        //                //return 'Once you refresh the page, your test will be invalidated.';
        // swal("Here's a message!")

        //            });



        // $('#btnStart').click(function() {

        //     if ($('#chkAgree').is(':checked')) {
        //         return true;
        //     } else {
        //         $('.checkbox').velocity("callout.shake", 750);
        //         $('.checkbox').addClass('error');
        //         return false;
        //     }
        // });

        // $('.checkbox').change(function() {
        //     if ($('input#chkAgree').prop('checked')) {
        //         $('.checkbox').removeClass('error');
        //     }
        // });



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
    location: config['default'].locationType,
    rootElement: "#main-content"
  });

  // Router.map(function() {
  // });

  // export default Router;

  //var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

  Router.map(function () {});

  // App.Router.map(function () {
  //     this.resource('questions', function () {
  //         this.resource('question', { path: ':question_id' });
  //     });
  // });


  exports['default'] = Router;
  //this.resource('questions');
  //this.resource('thank-you');
  //this.route('helper-test');
  // this.resource('posts', function() {
  //   this.route('new');
  // });

});
define('xd-online-test-project/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function () {
      return {
        html: [{
          id: "Question-1",
          question_name: "questions[question_1]",
          answer_name: "answers[answer_1]",
          display_name: "HTML5 Tag Semantics",
          textarea: "yes",
          radio: null,
          textfield: null,
          options: "",
          title: "HTML",
          body: "What are the benefits of using the HTML5 tag semantics?",
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
          id: "Question-3",
          question_name: "questions[question_3]",
          answer_name: "answers[answer_3]",
          display_name: "Widgets",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "How would you create a widget that would fit in a 250px wide area as well as a 400px wide area?",
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
          id: "Question-5",
          question_name: "questions[question_5]",
          answer_name: "answers[answer_5]",
          display_name: "IE8 & Responsive Web Design",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "Design/Performance/UX",
          body: "When building a responsive website, how would you deal with a browser that does not support media queries (such as IE8)?",
          answer: ""
        }, {
          id: "Question-6",
          question_name: "questions[question_6]",
          answer_name: "answers[answer_6]",
          display_name: "Input Fields",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "What HTML/CSS would create an input field that restricts the number of characters inside it to 10?",
          answer: ""
        }, {
          id: "Question-7",
          question_name: "questions[question_7]",
          answer_name: "answers[answer_7]",
          display_name: "Site Performance",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "Design/Performance/UX",
          body: "What are some ways you can improve a site's performance (load time)?",
          answer: ""
        }],
        css: [{
          id: "Question-8",
          question_name: "questions[question_8]",
          answer_name: "answers[answer_8]",
          display_name: "CSS Preprocessor",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Have you used a CSS preprocessor before? Which do you prefer, and why?",
          answer: ""
        }, {
          id: "Question-9",
          question_name: "questions[question_9]",
          answer_name: "answers[answer_9]",
          display_name: "CSS Positioning",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "List 3 types of CSS positioning, explain how they work, and explain the differences between them.",
          answer: ""
        }, {
          id: "Question-10",
          question_name: "questions[question_10]",
          answer_name: "answers[answer_10]",
          display_name: "Parent/Child Position",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "You would like a container that\'s of fluid width, with another nested inside it that has: a) padding, and b) 100% width (edge-to-edge within the container). What is the issue with this, and how is it typically resolved?",
          answer: ""
        }, {
          id: "Question-11",
          question_name: "questions[question_11]",
          answer_name: "answers[answer_11]",
          display_name: "ID vs Class",
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
          display_name: "Sass Variables",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "When using media queries that are defined by variables using Sass ($width-small: 400px), what is the solution for increasing the breakpoint by one value?",
          answer: ""
        }, {
          id: "Question-13",
          question_name: "questions[question_13]",
          answer_name: "answers[answer_13]",
          display_name: "CSS Selectors",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "What does the \">\" CSS selector mean?",
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
          body: "Briefly explain the advantages and disadvantages of using a CSS grid system.",
          answer: ""
        }, {
          id: "Question-17",
          question_name: "questions[question_17]",
          answer_name: "answers[answer_17]",
          display_name: "Supporting IE8",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "How would you handle the business requirements to a) support versions of Internet Explorer down to IE8, and b) use features that IE8 does not support (gradients, rounded corners, transitions, etc)?",
          answer: ""
        }, {
          id: "Question-18",
          question_name: "questions[question_18]",
          answer_name: "answers[answer_18]",
          display_name: "Pseudo...What",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "What are CSS pseudo-classes?",
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
          body: "Write the CSS necessary to make an object rotate.",
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
          body: "What\'s your experience with object-oriented JavaScript?",
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
          display_name: "IE7 and Child Selectors",
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
          display_name: "From This to That",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Using JavaScript, find the value of an element that can be used (and reused) to be output to another element.",
          answer: ""
        }, {
          id: "Question-24",
          question_name: "questions[question_24]",
          answer_name: "answers[answer_24]",
          display_name: "Truthy & JavaScript",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Explain the term \"truthy\" as it relates to comparisons in JavaScript.",
          answer: ""
        }, {
          id: "Question-25",
          question_name: "questions[question_25]",
          answer_name: "answers[answer_25]",
          display_name: "Console Outputs",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "What will the output be (in the console) from each of these statements: if(myvar === \"not defined\"){console.log(\"hello\")}\n\n if(myvar == \"not defined\"){console.log(\"hello\")}\n\n if(myvar = \"not defined\"){console.log(\"hello\")}.",
          answer: ""
        }, {
          id: "Question-26",
          question_name: "questions[question_26]",
          answer_name: "answers[answer_26]",
          display_name: "Catch Me if You Can",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Write a basic JavaScript try/catch block that all JavaScript functions should have.",
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
define('xd-online-test-project/routes/questions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function () {
      return {
        html: [{
          id: "Question-1",
          question_name: "questions[question_1]",
          answer_name: "answers[answer_1]",
          display_name: "HTML5 Tag Semantics",
          textarea: "yes",
          radio: null,
          textfield: null,
          options: "",
          title: "HTML",
          body: "What are the benefits of using the HTML5 tag semantics?",
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
          id: "Question-3",
          question_name: "questions[question_3]",
          answer_name: "answers[answer_3]",
          display_name: "Widgets",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "How would you create a widget that would fit in a 250px wide area as well as a 400px wide area?",
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
          id: "Question-5",
          question_name: "questions[question_5]",
          answer_name: "answers[answer_5]",
          display_name: "IE8 & Responsive Web Design",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "Design/Performance/UX",
          body: "When building a responsive website, how would you deal with a browser that does not support media queries (such as IE8)?",
          answer: ""
        }, {
          id: "Question-6",
          question_name: "questions[question_6]",
          answer_name: "answers[answer_6]",
          display_name: "Input Fields",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "HTML",
          body: "What HTML/CSS would create an input field that restricts the number of characters inside it to 10?",
          answer: ""
        }, {
          id: "Question-7",
          question_name: "questions[question_7]",
          answer_name: "answers[answer_7]",
          display_name: "Site Performance",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "Design/Performance/UX",
          body: "What are some ways you can improve a site's performance (load time)?",
          answer: ""
        }],
        css: [{
          id: "Question-8",
          question_name: "questions[question_8]",
          answer_name: "answers[answer_8]",
          display_name: "CSS Preprocessor",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "Have you used a CSS preprocessor before? Which do you prefer, and why?",
          answer: ""
        }, {
          id: "Question-9",
          question_name: "questions[question_9]",
          answer_name: "answers[answer_9]",
          display_name: "CSS Positioning",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "List 3 types of CSS positioning, explain how they work, and explain the differences between them.",
          answer: ""
        }, {
          id: "Question-10",
          question_name: "questions[question_10]",
          answer_name: "answers[answer_10]",
          display_name: "Parent/Child Position",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "You would like a container <div> that's of fluid width, with another <div> nested inside it that has: a) padding, and b) 100% width (edge-to-edge within the container). What is the issue with this, and how is it typically resolved?",
          answer: ""
        }, {
          id: "Question-11",
          question_name: "questions[question_11]",
          answer_name: "answers[answer_11]",
          display_name: "ID vs Class",
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
          display_name: "Sass Variables",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "When using media queries that are defined by variables using Sass ($width-small: 400px), what is the solution for increasing the breakpoint by one value?",
          answer: ""
        }, {
          id: "Question-13",
          question_name: "questions[question_13]",
          answer_name: "answers[answer_13]",
          display_name: "CSS Selectors",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "What does the \">\" CSS selector mean?",
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
          body: "Briefly explain the advantages and disadvantages of using a CSS grid system.",
          answer: ""
        }, {
          id: "Question-17",
          question_name: "questions[question_17]",
          answer_name: "answers[answer_17]",
          display_name: "Supporting IE8",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "How would you handle the business requirements to a) support versions of Internet Explorer down to IE8, and b) use features that IE8 does not support (gradients, rounded corners, transitions, etc)?",
          answer: ""
        }, {
          id: "Question-18",
          question_name: "questions[question_18]",
          answer_name: "answers[answer_18]",
          display_name: "Pseudo...What",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "CSS",
          body: "What are CSS pseudo-classes?",
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
          body: "Write the CSS necessary to make an object rotate.",
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
          display_name: "IE7 and Child Selectors",
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
          display_name: "From This to That",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Using JavaScript, find the value of an element that can be used (and reused) to be output to another element.",
          answer: ""
        }, {
          id: "Question-24",
          question_name: "questions[question_24]",
          answer_name: "answers[answer_24]",
          display_name: "Truthy & JavaScript",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Explain the term \"truthy\" as it relates to comparisons in JavaScript.",
          answer: ""
        }, {
          id: "Question-25",
          question_name: "questions[question_25]",
          answer_name: "answers[answer_25]",
          display_name: "Console Outputs",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "What will the output be (in the console) from each of these statements: if(myvar === \"not defined\"){console.log(\"hello\")}, if(myvar == \"not defined\"){console.log(\"hello\")}, if(myvar = \"not defined\"){console.log(\"hello\")}.",
          answer: ""
        }, {
          id: "Question-26",
          question_name: "questions[question_26]",
          answer_name: "answers[answer_26]",
          display_name: "Catch Me if You Can",
          textarea: "yes",
          textfield: null,
          radio: null,
          options: "",
          title: "JavaScript",
          body: "Write a basic JavaScript try/catch block that all JavaScript functions should have.",
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

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"brand pull-left\">\n	<img src=\"assets/logo-xd-redwhite.png\" alt=\"Perficient XD\">\n</div>");
    
  });

});
define('xd-online-test-project/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/component-test', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<h1>Hello</h1>\n");
    
  });

});
define('xd-online-test-project/templates/components/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push(" <header>\n    <div class=\"container\">\n        <div class=\"row\">\n          <div class=\"col-md-3 col-sm-3 col-sm-3 col-xs-3\">\n             <div class=\"logo\">\n                <img src=\"assets/logo-white.png\" alt=\"Perficient XD\" >\n            </div>\n            <!--<ul>\n              <li><a href=\"#about\">About</a></li>\n              <li><a href=\"#portfolio\">Portfolio</a></li>\n              <li><a href=\"#services\">Services</a></li>\n              <li><a href=\"#clients\">Clients</a></li>\n              <li><a href=\"#culture\">Culture</a></li>\n              <li class=\"contactnav\"><a href=\"#contact\">Contact</a></li>\n              <li id=\"prft\"><a href=\"http://www.perficient.com/\" target=\"_blank\">Perficient.com</a></li>\n            </ul>-->\n          </div>\n          <div class=\"col-md-4 col-sm-4\">\n            <h3 class=\"test-title\">Skills Assessment</h3>\n          </div>\n          </div>\n        </div>\n    </header>");
    
  });

});
define('xd-online-test-project/templates/components/terms-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push(" <!-- Modal: Terms and Conditions -->\n        <!-- Modal -->\n        <div class=\"modal fade\" id=\"termsModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" data-backdrop=\"static\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">x</button>\n                        <p class=\"title\" style=\"text-align:center;\">Perficient Terms and Conditions</p>\n                        <p class=\"title\" style=\"text-align:center;\">Before you taking the programming test please read the terms and conditions</p>\n                    </div>\n                    <div class=\"modal-body\">\n                        <strong>Term #1 - Transfer of your 1st born to Perficient</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                        <strong>Term #2 - Complaints about having to transfer your 1st born to Perficient</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                        <strong>Term #3 - We already told you we're taking your 1st born so shut up already. You want this job don't you?</strong>\n                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n                    </div>\n                </div><!-- /.modal-content -->\n            </div><!-- /.modal-dialog -->\n        </div><!-- /.modal -->\n");
    
  });

});
define('xd-online-test-project/templates/error', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
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
define('xd-online-test-project/templates/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("					<div class=\"navbar navbar-fixed-top\">\n						<header>\n							");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "logo", options) : helperMissing.call(depth0, "partial", "logo", options))));
    data.buffer.push("\n							<div class=\"pull-left app-title\">\n								<h1>Skills Assessment</h1>\n							</div>\n						</header>\n					</div>\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/helper-test', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
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

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header", options) : helperMissing.call(depth0, "partial", "header", options))));
    data.buffer.push("\n         <!-- Login -->\n        \n               \n                \n                  \n                        \n                           ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "questions", options) : helperMissing.call(depth0, "partial", "questions", options))));
    data.buffer.push("\n                       \n                    \n                \n        \n\n       \n\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<h1>Loading...</h1>\n");
    
  });

});
define('xd-online-test-project/templates/question', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                ");
    stack1 = helpers.view.call(depth0, "Ember.area", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                <div class=\"chars\">Characters remaining: <span></span></div>\n            ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                ");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'value': ("answer"),
      'name': ("answer_name"),
      'maxlength': ("140"),
      'class': ("form-control"),
      'data-limit': ("40")
    },hashTypes:{'value': "ID",'name': "ID",'maxlength': "STRING",'class': "STRING",'data-limit': "STRING"},hashContexts:{'value': depth0,'name': depth0,'maxlength': depth0,'class': depth0,'data-limit': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n                ");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                ");
    stack1 = helpers['if'].call(depth0, "textfield", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                \n                ");
    stack1 = helpers['if'].call(depth0, "radio", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program5(depth0,data) {
    
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

  function program7(depth0,data) {
    
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

    data.buffer.push("         <div class=\"row welcome-text\">\n                <div class=\"col-xs-12\">\n                    <span class=\"visible-xs-inline\">");
    stack1 = helpers._triageMustache.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" of 26</span>\n                    <h3>");
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
    stack1 = helpers['if'].call(depth0, "textarea", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/questions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("Begin");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n								  ");
    stack1 = helpers['if'].call(depth0, "_view.contentIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n								  ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n								  <div class=\"question-info hidden\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'id': ("id")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n									");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "question", options) : helperMissing.call(depth0, "partial", "question", options))));
    data.buffer.push("\n								  </div>\n\n								  ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n								  <div class=\"question-info form-horizontal\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'id': ("id")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n									");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "question", options) : helperMissing.call(depth0, "partial", "question", options))));
    data.buffer.push("\n								  </div>\n								  ");
    return buffer;
    }

  function program8(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n								  ");
    stack1 = helpers['if'].call(depth0, "_view.contentIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(9, program9, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n								  ");
    return buffer;
    }
  function program9(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n								  <div class=\"question-info form-horizontal hidden\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'id': ("id")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n									");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "question", options) : helperMissing.call(depth0, "partial", "question", options))));
    data.buffer.push("\n								  </div>\n								  ");
    return buffer;
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("Previous");
    }

  function program13(depth0,data) {
    
    
    data.buffer.push("Next");
    }

  function program15(depth0,data) {
    
    
    data.buffer.push("Submit All Answers");
    }

  function program17(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n											<li>\n											\n											");
    stack1 = helpers.view.call(depth0, "Ember.Question", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n											\n											</li>\n										  ");
    return buffer;
    }
  function program18(depth0,data) {
    
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

    data.buffer.push("\n<div class=\"wrap\">\n	<div class=\"main\">\n	  <div class=\"row\">\n		  <div class=\"col-xs-12\">\n			  <div id=\"question-page\">\n				  <form id=\"questionnaire_form\" role=\"form\">\n					  <div id=\"my-info\">\n					  	<div class=\"row\">\n					  		<div class=\"col-xs-offset-2 col-xs-8 col-sm-offset-3 col-sm-6\">\n					  			<h2>Skills Assessment Test</h2>\n					  			<p>This is a skills assessment test. It is the first step in the process of interviewing for a UI Development position with PerficientXD. What follows is a list of questions in the categories of HTML, CSS, and JavaScript.</p>\n					  			<p>Answer as many as you can, honestly, and to the best of your ability, and do not look on the internet for solutions. We will review your assessment and get back with you.</p>\n							</div>\n					  	</div>\n						<div class=\"row\">\n							<fieldset class=\"col-xs-offset-2 col-xs-8 col-sm-offset-3 col-sm-6\">\n								<legend>Please Enter Your Information</legend>\n\n								<div class=\"form-group\">\n									<input type=\"text\" placeholder=\"Your Name\" id=\"name\" name=\"name\" class=\"ember-view ember-text-field form-control error\" data-rule-required=\"true\" data-rule-alpha=\"true\" data-msg-required=\"Please enter a valid name\">\n								</div>\n								<div class=\"form-group\">\n									<input type=\"email\" placeholder=\"Your Email Address\" id=\"email\" name=\"email\" class=\"ember-view ember-text-field form-control\" data-rule-required=\"true\" data-msg-required=\"Please enter a valid email address\" data-rule-email=\"true\">\n								</div>\n                            \n								<div class=\"form-group\">\n									\n									");
    stack1 = helpers.view.call(depth0, "Ember.BeginTest", {hash:{
      'id': ("begin-my-test")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n								</div>\n							</fieldset>\n						</div>\n					</div>\n\n					  <div id=\"test-questions\">\n						  <div class=\"row\">\n\n							  <div class=\"col-sm-8 rightcol\">\n								  ");
    stack1 = helpers.each.call(depth0, "model.html", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n								  ");
    stack1 = helpers.each.call(depth0, "model.css", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n								  ");
    stack1 = helpers.each.call(depth0, "model.js", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n								<div class=\"row actions\">\n							  		");
    stack1 = helpers.view.call(depth0, "Ember.Previous", {hash:{
      'id': ("previous")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n							  		");
    stack1 = helpers.view.call(depth0, "Ember.Next", {hash:{
      'id': ("next")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n							  		");
    stack1 = helpers.view.call(depth0, "Ember.Submit", {hash:{
      'id': ("submit")
    },hashTypes:{'id': "STRING"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n								</div>\n\n							  </div>\n							  \n							  <div class=\"hidden-xs col-sm-4 leftcol\">\n								  <h3 class='questions-title'>Questions</h3>\n								  <nav>\n									<div class=\"navbar\">\n									  <div class=\"navbar-inner\">\n										  <h4 class=\"category\">HTML5</h4>\n										  <ol class=\"question\">\n										  ");
    stack1 = helpers.each.call(depth0, "model.html", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n										  </ol>\n\n										  <h4 class=\"category\">CSS</h4>\n										  <ol class=\"question\">\n										  ");
    stack1 = helpers.each.call(depth0, "model.css", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n										  </ol>\n\n										  <h4 class=\"category\">JavaScript</h4>\n										  <ol class=\"question\">\n										  ");
    stack1 = helpers.each.call(depth0, "model.js", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n										  </ol>\n									  </div>\n									</div>\n								  </nav>\n							  </div>\n\n						  </div>\n\n					  </div>\n				  </form>\n			  </div>\n			  <div id=\"thank-you\" class=\"hidden\">\n				  <div class=\"alert alert-success\" role=\"alert\">\n					  Thank you! Your answers have been successfully submitted. We will review and get back to you.\n				  </div>\n			  </div>\n		  </div>\n		</div>\n	</div>\n</div>\n\n\n");
    return buffer;
    
  });

});
define('xd-online-test-project/templates/thank-you', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
  /**/) {
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