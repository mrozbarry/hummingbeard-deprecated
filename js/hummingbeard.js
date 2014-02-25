
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

  // Make a unique id, handy for assigning beardvo widgets
  function hummingbeard_guid() {
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  /* HummingBeard */

  // Hummingbeard Conversation
  window.HummingBeardvo = function( parent, options ) {

    /*  */

    this.hummingbeard = parent;
    
    var self = this;

    this.options = hummingbeard_object_merge( {
      id: hummingbeard_guid(),
      name: 'New Conversation',
      heading_minimizes: true,
      focus_notifications: [],
      blurred_notifications: [ "message" ],
      hide_fn: function( conversation ) {
        var classes = conversation.beardvo.className.split(' ');
        for(var c=0; c < classes.length; c++) {
          if ( classes[c] == "visible" ) {
            classes.splice( c, 1 );
            break;
          }
        }
        classes.push( "hidden" );
        conversation.beardvo.className = classes.join( ' ' );
      },
      show_fn: function( conversation ) {
        var classes = conversation.beardvo.className.split(' ');
        for(var c=0; c < classes.length; c++) {
          if ( classes[c] == "hidden" ) {
            classes.splice( c, 1 );
            break;
          }
        }
        classes.push( "visible" );
        conversation.beardvo.className = classes.join( ' ' );
      },
      close_fn: function( conversation ) {
        conversation.hummingbeard.beardbox.removeChild( beardvo );
      }
    }, options );

    this.beardvo = window.document.createElement('div');
    this.beardvo.className = parent.options.chat_dialog_class + " visible";
    this.beardvo.setAttribute( "id", this.options.id );

    // Header/Conversation title
    var heading = window.document.createElement( 'span' );
    heading.className = 'heading';
    heading.innerHTML = this.options.name;

    if ( this.options.heading_minimizes )
    {
      heading.onclick = function() {
        var classes = self.beardvo.className.split(' ');
        var isVisible = true;
        for(var c=0; c < classes.length; c++) {
          if ( classes[c] == "visible" ) isVisible = true;
          else if ( classes[c] == "hidden" ) isVisible = false;
        }
        if ( isVisible ) self.options.hide_fn( self );
        else self.options.show_fn( self );
      }
    }

    // Close button in header
    var close = window.document.createElement( 'span' );
    close.className = 'close';
    close.innerHTML = '&times;';
    close.onclick = function() {
      self.options.close_fn( self.beardvo );
    };
    heading.appendChild( close );

    this.beardvo.appendChild( heading );

    // Container element to put messages into
    var container = window.document.createElement( 'div' );
    container.className = 'container';
    this.beardvo.appendChild( container );

    // Input box for chatting
    var input = window.document.createElement( 'input' );
    input.className = 'talk';
    input.setAttribute( 'placeholder', 'Type <enter> to send your message' );
    // Handle pressing enter with text
    input.onkeypress = function( keyevent ) {
      var k = keyevent.keyCode ? keyevent.keyCode : keyevent.which;
      var text = this.value;
      if ( text.length )
      {
        if ( k == 13 )
        {
          self.add_message( "Me", text );
          this.value = "";
        }
      }
    };

    this.beardvo.appendChild( input );

    // Listen for adding messages to this conversation
    this.beardvo.addEventListener( "hummingbeard.add_message", function(e){
      var message = window.document.createElement( 'div' );
      message.className = 'message';

      var from = window.document.createElement( 'span' );
      from.className = e.detail.parent.options.chat_message_author_class;
      from.innerHTML = e.detail.from + ':&nbsp;';
      message.appendChild( from );

      var content = window.document.createTextNode( e.detail.message );
      message.appendChild( content );
      container.appendChild( message );

      // Attempt to scroll or focus the last message
      try {
        container.scrollTop = container.scrollHeight;
      } catch(e) {
        message.focus();
      }
    });

    this.hummingbeard.beardbox.appendChild( this.beardvo );

    this.add_message = function( from, content ) {
      var e = new CustomEvent( "hummingbeard.add_message", {
        'detail': {
          'parent': this.hummingbeard,
          'conversation': this,
          'from': from,
          'message': content
        }
      });
      this.beardvo.dispatchEvent( e );
      return true;
    };

  };

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

    /* A nice place to store those beardvos */
    this.beardvos = [];

    /* Initialize the main document object */

    this.beardbox = window.document.createElement('div');
    this.beardbox.className = this.options.chat_container_class;
    
    this.beardbox.addEventListener( "hummingbeard.add_conversation", function(e){
      // Add a new conversation to the beardbox
      e.detail.parent.beardvos.push( new HummingBeardvo( e.detail.parent, {} ) );
    }, false);
    
    // Get ride of a conversation (user closes the conversation?)
    this.beardbox.addEventListener( "hummingbeard.remove_conversation", function(e){
      // Remove a conversation from the beardbox
    }, false);
    
    window.document.body.appendChild( this.beardbox );

    // Find an active conversation in the beardbox
    this.find_conversation = function( chatname ) {
      if ( !chatname ) return null;
      if ( this.beardbox.hasChildNodes() ) {
        var cache = this.beardbox.childNodes;
        for(var c=0; c < cache.length; c++) {
          var beardvo = cache[c];
          // Make sure it is actually a converstation with a target
          if ( beardvo.hasAttribute( "data-chatname" ) )
          {
            if ( beardvo.getAttribute( "data-chatname" ) == chatname ) return beardvo;
          }
        }
      }
      return null;
    };

    // Add a new conversation to the beardbox
    this.add_conversation = function( chatname, options ) {
      var e = new CustomEvent( "hummingbeard.add_conversation", { 'detail': { 'parent': this, 'chatname': chatname } } );
      this.beardbox.dispatchEvent( e );
    };

    // Add a message to a conversation in the beardbox
    this.add_message = function( chatname, from, message ) {
      var beardvo = this.find_conversation( chatname );
      if ( beardvo == null ) return false;
      var e = new CustomEvent( "hummingbeard.add_message", { 'detail': { 'parent': this, 'from': from, 'message': message } } );
      beardvo.dispatchEvent( e );
      return true;
    };

  }

})();