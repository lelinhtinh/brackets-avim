/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, AVIMObj, $ */

define(function (require, exports, module) {
    "use strict";

    var Menus              = brackets.getModule("command/Menus"),
        KeyBindingManager  = brackets.getModule("command/KeyBindingManager"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        AppInit            = brackets.getModule("utils/AppInit"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        StatusBar          = brackets.getModule("widgets/StatusBar"),
        DropdownButton     = brackets.getModule("widgets/DropdownButton").DropdownButton;

    var COMMAND_ID      = "baivong.avim",
        COMMAND_AVIM_ON = COMMAND_ID + ".on",
        avimPreferences = PreferencesManager.getExtensionPrefs(COMMAND_ID);

    var avimOn       = avimPreferences.get("on"),
        avimMethod   = avimPreferences.get("method"),
        avimShortcut = avimPreferences.get("shortcut");
    
    var avimMenu, avimMethodSelect;

    require("avim");

    if (avimOn === undefined) {
        avimOn = true;
    }

    if (avimMethod === undefined) {
        avimPreferences.set("method", 0);
        avimMethod = avimPreferences.get("method");
    }
    
    if (avimShortcut === undefined) {
        avimShortcut = "Ctrl-Shift-G";
        avimPreferences.set("shortcut", avimShortcut);
    }
    
    function updateDropdownButtonText() {
        if (!avimOn) {
            avimMethodSelect.$button.text("AVIM OFF");
        } else {
            avimMethodSelect.$button.text(avimMethodSelect.items[avimMethod]);
        }
    }
    
    function avimUpdateState() {
        if (avimOn) {
            avimOn = false;
            AVIMObj.setMethod(-1);
        } else {
            avimOn = true;
            AVIMObj.setMethod(avimMethod);
        }
        avimMenu.setChecked(avimOn);
        avimPreferences.set("on", avimOn);
        updateDropdownButtonText();
    }
    
    avimMethodSelect = new DropdownButton(
        "",
        ["Auto", "Telex", "VNI", "VIQR", "VIQR*", "---", "AVIM OFF"]
    );
    
    avimMethodSelect.on("select", function (e, method, currentIndex) {
        if (currentIndex === 6) {
            avimOn = false;
            AVIMObj.setMethod(-1);
        } else {
            avimOn = true;
            avimMethod = currentIndex;
            AVIMObj.setMethod(avimMethod);
            avimPreferences.set("method", avimMethod);
        }
        avimMenu.setChecked(avimOn);
        avimPreferences.set("on", avimOn);
        updateDropdownButtonText();
    });
    
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
        updateDropdownButtonText(); // Show status at startup
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_AVIM_ON);
    
    KeyBindingManager.addBinding(COMMAND_AVIM_ON, avimShortcut);
    
    StatusBar.addIndicator(
        "avim-method",
        avimMethodSelect.$button,
        true,
        "btn btn-dropdown btn-status-bar",
        "Thay đổi kiểu gõ",
        "status-overwrite"
    );
    
});

