/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, AVIMObj, $ */

define(function (require, exports, module) {
    "use strict";

    var Menus              = brackets.getModule("command/Menus"),
        KeyBindingManager  = brackets.getModule("command/KeyBindingManager"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        AppInit            = brackets.getModule("utils/AppInit"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager");

    var COMMAND_ID      = "baivong.avim",
        COMMAND_AVIM_ON = COMMAND_ID + ".on",
        avimPreferences = PreferencesManager.getExtensionPrefs(COMMAND_ID);

    var avimOn       = avimPreferences.get("on"),
        avimMethod   = avimPreferences.get("method"),
        avimShortcut = avimPreferences.get("shortcut");
    
    var $avimStatus = $("<div class='avim-status'></div>");
    
    var avimMenu;

    require("avim");

    if (avimOn === undefined) {
        avimOn = true;
    }

    if (avimMethod === undefined) {
        avimPreferences.set("method", 0);
    }
    
    if (avimShortcut === undefined) {
        avimShortcut = "Ctrl-Shift-G";
        avimPreferences.set("shortcut", avimShortcut);
    }

    function avimUpdateStatus() {
        if (avimPreferences.get("on")) {
            $avimStatus.text("AVIM: Bật");
        } else {
            $avimStatus.text("AVIM: Tắt");
        }
    }
    
    function avimUpdateState() {
        if (avimPreferences.get("on")) {
            avimOn = false;
            AVIMObj.setMethod(-1);
        } else {
            avimOn = true;
            AVIMObj.setMethod(avimPreferences.get("method"));
        }
        avimMenu.setChecked(avimOn);
        avimPreferences.set("on", avimOn);
        avimUpdateStatus();
    }
    
    avimMenu = CommandManager.register("Bộ gõ AVIM", COMMAND_AVIM_ON, avimUpdateState);

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
        avimUpdateStatus(); // Show AVIM status on startup
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_AVIM_ON);
    
    KeyBindingManager.addBinding(COMMAND_AVIM_ON, avimShortcut);
    
    $avimStatus.appendTo("#status-indicators");
    $avimStatus.addClass("btn-status-bar");
    $avimStatus.attr("title", "Nhấp vào để bật/tắt AVIM");
    $avimStatus.on("click", avimUpdateState);

});

