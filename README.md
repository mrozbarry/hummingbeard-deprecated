hummingbeard
============

XMPP Framework inspired by [Hummingbird](https://github.com/alagu/hummingbird)

Why make another chat client?
-----------------------------

Many available chat clients are not extendable, or are only available using a freemium model.  This is not acceptable.  Web developers should have the ability to grab a simple chat widget and just use it, regardless of their protocol.  Chat clients should also be customizable, while using simple markup.  Chat clients should also have easy to follow code.  I believe hummingbeard does all these things, and does them well.

Host do I include it?
---------------------

In general, you'll want to add your hummingbeard scripts in this order:

```
<script type="text/javascript" src="js/hummingbeard.js"></script>
<script type="text/javascript" src="js/driver_dependency.js"></script>
<script type="text/javascript" src="js/driver.js"></script>
```
Where `driver_dependency` may be a list of javascripts (in the case of XMPP, just strophe.js), then the layer between the chat UI and your messaging system (with XMPP, `hummingbeard_xmpp.js`).

How do I use it with my existing chat solution?
-----------------------------------------------


