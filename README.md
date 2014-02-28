hummingbeard
============

XMPP Framework inspired by [Hummingbird](https://github.com/alagu/hummingbird)

Why make another chat client?
-----------------------------

Many available chat clients are not extendable, or are only available using a freemium model.  This is not acceptable.  Web developers should have the ability to grab a simple chat widget and just use it, regardless of their protocol.  Chat clients should also be customizable, while using simple markup.  Chat clients should also have easy to follow code.  I believe hummingbeard does all these things, and does them well.

What dependencies are used?
---------------------------

HummingBeard.js on it's own uses no dependencies.  I did this so you can plug it into your underscore, jquery, mootools, or what-have-you frameworks.  HummingBeard is designed to be light weight and fast.

Now, you're likely not just using HummingBeard unless you're just doing a quick mock-up.  In the real world, you will have this connected to a driver, which may have some dependencies; for example, using XMPP will force you to use [`strophe.js`](https://github.com/strophe/strophejs).  I have purposefully used `strophe.js` not only because it's popular, but it also has no extra dependencies (no jquery or any such silliness).  When other drivers are built, they should always have little to no dependencies.  For more information, check the contributing section below.

Host do I include it?
---------------------

In general, you'll want to add your hummingbeard scripts in this order:

```
<script type="text/javascript" src="js/hummingbeard.js"></script>
<script type="text/javascript" src="js/driver_dependency.js"></script>
<script type="text/javascript" src="js/driver.js"></script>
```
Where `driver_dependency` may be a list of javascripts (in the case of XMPP, just `strophe.js`), then the `driver` (layer between the chat UI and your messaging system; with XMPP, `hummingbeard_xmpp.js`).

How do I use it with my existing chat solution?
-----------------------------------------------

This all depends on the protocol.  If I have a driver provided, then just toss the driver in, and you're set!

Contibuting
-----------

I will accept pull requests for fixes to the current code base, interesting examples, and new drivers.  If you are submitting a new driver, you need to contribute the following:
 * List all javascript dependencies (with their versions)
 * Link to the source/website of any dependencies
 * Provide a local copy of any dependency that is known to work
 * Provides an working example of your driver in action.
 * Some sort of documentation (comments in the source, embedded it in your example page, or whatever works)
 * List all authors and their respective contact information (website, email, or whatever you want so you can be attributed properly)

I will not accept driver pull requests if:
 * It does not provide the above information.  It's really important to document these things so other developers can
 * Has a hard dependency (or includes an embedded copy) on jQuery, underscore, mootools, or another cross-browser javascript framework.  This is not so this code does not work on all browsers, but so any driver will play nice with any framework.
 * Another driver for the same protocol already exists.  In this case, please submit patches to existing drivers so they can all have the highest standard of code; we definitely don't want two drivers for the same protocol and both supporting different features.