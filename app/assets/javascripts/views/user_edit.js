Large.Views.UserEdit = Backbone.View.extend({
  template: JST['users/user_edit'],

  events: {
    "click .follow": "toggleFollow",
    "click .user-header-image": "addHeaderImage",
    "click .save-edits": "saveEdits"
  },

  initialize: function (options) {
    this.user = options.user;
    this.stories = this.user.stories();
    this.publications = options.publications;
    this.currentUserFollows = options.follows;

    this.follows = this.user.followers();
    this.followings = this.user.followedUsers();

    this.listenTo(this.currentUserFollows, 'sync add remove', this.render);
    this.listenTo(this.user, 'sync', this.render);
    this.listenTo(this.stories, 'sync', this.render);
    this.listenTo(this.publications, 'sync', this.render);
  },

  render: function () {
    $('.navbar-nav').find('.user-edit-toggle').remove();
    // debugger
    var content = this.template({ user: this.user, followers: this.follows, followings: this.followings });
    this.$el.html(content);

    var follow = this.currentUserFollows.findWhere({
                      followable_id: this.user.id,
                      followable_type: "User" });
    if (!!follow) {
      $('.follow').data('follow-state', 'followed');
    } else {
      $('.follow').data('follow-state', 'unfollowed');
    }

    if ($('.follow').data('follow-state') == "followed") {
      $('.follow').html("Unfollow!");
    } else {
      $('.follow').html("Follow!");
    }

    this.stories.models.forEach( function(story) {
      var storyPreview = new Large.Views.StoryPreview({ model: story, publications: this.publications });
      this.$('ul.user-stories').prepend(storyPreview.render().$el);
    }.bind(this));
    this.$("abbr.timeago").timeago();

    $('.edit-email').focus();
    return this;
  },

  toggleFollow: function () {
    var follow = this.currentUserFollows.findWhere({
                      followable_id: this.user.id,
                      followable_type: "User" });

    if (follow === undefined) {
      follow = new Large.Models.Follow({ followable_id: this.user.id, followable_type: "User" });
      follow.save(follow.attributes, {
        success: function () {
          $(event.currentTarget).data('follow-state', 'followed');
          $(event.currentTarget).html("Unfollow!");
        }
      });
    } else {
      follow.destroy({
        success: function (model, response) {
          $(event.currentTarget).data('follow-state', 'unfollowed');
          $(event.currentTarget).html("Follow!");
        }
      });
    }
  },

  addHeaderImage: function (event) {
    event.preventDefault();

    filepicker.setKey("AFA8IlPkxSNC1BPrgoHtsz");
    filepicker.pick(
      {
        mimetypes:'image/*',
        services:'COMPUTER'
      },
      function (Blob) {
        var image = Blob.url;
        this.user.set("header_image", image);
        this.$('.user-header-image').css('background-image', "url('" + image + "')");
      }.bind(this)
    )
  },

  saveEdits: function (event) {
    event.preventDefault();
    if ($('.edit-email').val() === "") {
      $('#blankStoryError').modal('show');
      setTimeout( function () {
        $('#blankStoryError').modal('hide');
      }, 2500)
    } else {
      var formData = this.$('form').serializeJSON();

      this.user.save(formData.user, {
        success: function () {
          Backbone.history.navigate("users/" + this.user.id, { trigger: true });
        }.bind(this)
      });
    }
  }

});
