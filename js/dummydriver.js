/*
 * HummingBeard Dummy Driver
 * Local chat driver for HummingBeard.
 * Works by having two HummingBeard sessions in one page, and having one communicate with another
 *
 */

 (function(){

    /*
     * HummingBeardLocalConnection
     * Connection manager for local (DOM-level) communications
     * This is only meant to be an example, and not really useful
     * in the real world
     */
    HummingBeardLocalConnection = function( driver, options ) {
      HummingBeardConnection.call( this, driver, options );

      // If this were a networked protocol, we would want to place our connection code in here!

      this.relay = function( from, to, message ) {
        console.log( 'relay', from, to, message );
        if ( Array.isArray( to ) ) {
          var part_size = to.length;
          for(var r=0; r < to.length; r++) {
            var connection = this.driver.find_connection( to[r] );
            if ( !connection ) continue;

            var party = [ from ];
            for(var t=0; t < to.length; t++)
              if ( r != t ) party.push( to[t] );

            var found = -1;
            for(var c=0; c < connection.chats.length; c++) {
              var chat = connection.chats[c];
              console.log( chat.hummingbeard, connection.options.userid );
              if ( chat.hummingbeard.options.userid == connection.options.userid ) {
                var participant_count = 0;
                for(var p=0; p < party.length; p++) {
                  if ( chat.participants.indexOf( party[p] ) >= 0 ) {
                    participant_count++;
                  }
                }
                if ( participant_count == part_size ) {
                  found = c;
                  break;
                }
              }
              chat = null;
            }
            var current = null;
            if ( found >= 0 ) {
              // Use the chat window
              current = connection.chats[c];
              console.log( 'appending chat', current );
            } else {
              // Looks like we need to create a chat
              current = connection.chat( party );
              console.log( 'new chat', connection, current, party );
            }
            var self = this;
            current.hummingbeard.add_message({
              'userid': from,
              'status': 'received',
              'userid_suffix': ' says: ',
              'content': message
            });

          }
        } else console.log( 'HummingBeardLocalConnection.relay', 'Error, expecting "to" to be an array', to );
      };

    };

    window.HummingBeardLocalConnection.prototype = new HummingBeardConnection();
    window.HummingBeardLocalConnection.prototype.constructor = HummingBeardLocalConnection;

    /*
     * HummingBeardLocalDriver
     * 
     */
    HummingBeardLocalDriver = function( options ) {

      this.options = HummingBeardUtil.object_merge({
        // Any default values for this driver?
        'driver_name': 'local_driver',
        'driver_authors': ['MrBarrySoftware'],
        'driver_version': '0.1.1',
        // Some little hacks since we're not using a real protocol
        'proxy': document.createElement( 'p' )
      }, options)

      HummingBeardDriver.call( this, this.options );

      this.connect_internal = function( userid ) {
        return new HummingBeardLocalConnection(this, {
          'userid': userid,
          default_hummingbeard_options: { 'debug': true }
        });
      }

    };

    window.HummingBeardLocalDriver.prototype = new HummingBeardDriver();
    window.HummingBeardLocalDriver.prototype.constructor = HummingBeardLocalDriver;

 })();