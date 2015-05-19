/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, AVIMObj */

define(function (require, exports, module) {
    "use strict";

    var Menus = brackets.getModule("command/Menus"),
        AppInit = brackets.getModule("utils/AppInit"),
        CommandManager = brackets.getModule("command/CommandManager"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");

    var COMMAND_ID = "baivong.avim",
        COMMAND_AVIM_ON = COMMAND_ID + ".on",
        avimPreferences = PreferencesManager.getExtensionPrefs(COMMAND_ID);

    var avimOn = avimPreferences.get("on"),
        avimMethod = avimPreferences.get("method");

    require("avim");

    if (avimOn === undefined) {
        avimOn = true;
    }

    if (avimMethod === undefined) {
        avimPreferences.set("method", 0);
    }

    var avimMenu = CommandManager.register("Bộ gõ AVIM", COMMAND_AVIM_ON, function () {
        if (avimPreferences.get("on")) {
            avimOn = false;
            AVIMObj.setMethod(-1);
        } else {
            avimOn = true;
            AVIMObj.setMethod(avimPreferences.get("method"));
        }
        avimMenu.setChecked(avimOn);
        avimPreferences.set("on", avimOn);
    });

    if (avimOn) {
        avimMenu.setChecked(true);
        avimPreferences.set("on", true);
    }

    AppInit.appReady(function () {
        if (avimPreferences.get("on")) {
            AVIMObj.setMethod(avimPreferences.get("method"));
        } else {
            AVIMObj.setMethod(-1);
        }
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_AVIM_ON);

});
