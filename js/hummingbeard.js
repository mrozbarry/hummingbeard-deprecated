
/* Wrap it before you tap it...or something like that */
(function(){
  /* Utility */

  // Function to emulate $.extend() and the likes
  function hummingbeard_object_merge( a, b ) {
    //if ( !b ) return a;
    for( var p in b ) {
      try {
        if ( b[p].constructor == Object ) {
          a[p] = object_merge( a[p], b[p] );
        } else {
          a[p] = b[p];
        }
      } catch (e) {
        a[p] = b[p];
      }
    }
    return a;
  }

  /* HummingBeard */

  // Main object
  window.HummingBeard = function( options ) {

    /* Merge User and Default Options */
    
    this.options = hummingbeard_object_merge( {
      bosh_service: 'http://localhost:5280/http-bind',
      jabber_host: 'localhost',
      username: 'test@localhost',
      active_chat_limit: 1,
      chat_container_class: 'chat_container',
      chat_dialog_class: 'chat_dialog',
      chat_message_author_class: 'chat_message_author'
    }, options );

    console.log( this.options );

    /* Initialize the main document object */

    this.beardbox = window.document.createElement('div');
    this.beardbox.className = this.options.chat_container_class;
    
    this.beardbox.addEventListener( "hummingbeard.add_conversation", function(e){
      // Add a new conversation to the beardbox
      var beardvo = window.document.createElement('div');
      beardvo.className = e.detail.parent.options.chat_dialog_class;
      beardvo.setAttribute( "data-target_username", e.detail.username );

      var heading = window.document.createElement( 'span' );
      heading.className = 'heading';
      heading.innerHTML = e.detail.username;
      var close = window.document.createElement( 'a' );
      close.className = 'close';
      close.innerHTML = '&times;';
      heading.appendChild( close );

      beardvo.appendChild( heading );

      var container = window.document.createElement( 'div' );
      container.className = 'container';
      beardvo.appendChild( container );

      var input = window.document.createElement( 'input' );
      input.className = 'talk';
      input.setAttribute( 'placeholder', 'Type <enter> to send your message' );
      input.onkeypress = function( keyevent ) {
        var k = keyevent.keyCode ? keyevent.keyCode : keyevent.which;
        var text = this.value;
        if ( text.length )
        {
          if ( k == 13 )
          {
            e.detail.parent.add_message( e.detail.username, "Me", text );
            this.value = "";
          }
        }
      };

      beardvo.appendChild( input );

      beardvo.addEventListener( "hummingbeard.add_message", function(e){
        var message = window.document.createElement( 'div' );
        message.className = 'message';
        var from = window.document.createElement( 'span' );
        from.className = e.detail.parent.options.chat_message_author_class;
        from.innerHTML = e.detail.from + ':&nbsp;';
        message.appendChild( from );
        var content = window.document.createTextNode( e.detail.message );
        message.appendChild( content );
        container.appendChild( message );

        try {
          container.scrollTop = container.scrollHeight;
        } catch(e) {
          message.focus();
        }
      });
      
      e.detail.parent.beardbox.appendChild( beardvo );
    }, false);
    
    this.beardbox.addEventListener( "hummingbeard.remove_conversation", function(e){
      // Remove a conversation from the beardbox
    }, false);
    
    window.document.body.appendChild( this.beardbox );

    this.find_conversation = function( user_target ) {
      if ( !user_target ) return null;
      if ( this.beardbox.hasChildNodes() ) {
        var cache = this.beardbox.childNodes;
        for(var c=0; c < cache.length; c++) {
          var beardvo = cache[c];
          // Make sure it is actually a converstation with a target
          if ( beardvo.hasAttribute( "data-target_username" ) )
          {
            if ( beardvo.getAttribute( "data-target_username" ) == user_target ) return beardvo;
          }
        }
      }
      return null;
    };

    this.add_conversation = function( user_target ) {
      var e = new CustomEvent( "hummingbeard.add_conversation", { 'detail': { 'parent': this, 'username': user_target } } );
      this.beardbox.dispatchEvent( e );
    };

    this.add_message = function( user_target, from, message ) {
      var beardvo = this.find_conversation( user_target );
      if ( beardvo == null ) return false;
      var e = new CustomEvent( "hummingbeard.add_message", { 'detail': { 'parent': this, 'from': from, 'message': message } } );
      beardvo.dispatchEvent( e );
      return true;
    };

  }

})();