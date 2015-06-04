/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, AVIMObj */

define(function (require) {
    "use strict";

    var Menus = brackets.getModule("command/Menus"),
        KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        CommandManager = brackets.getModule("command/CommandManager"),
        AppInit = brackets.getModule("utils/AppInit"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        StatusBar = brackets.getModule("widgets/StatusBar"),
        DropdownButton = brackets.getModule("widgets/DropdownButton");

    var COMMAND_ID = "baivong.avim",
        COMMAND_AVIM_ON = COMMAND_ID + ".on",
        avimPreferences = PreferencesManager.getExtensionPrefs(COMMAND_ID);

    var avimOn = avimPreferences.get("on"),
        avimMethod = avimPreferences.get("method"),
        avimShortcut = avimPreferences.get("shortcut");
    
    // Danh sách các kiểu gõ
    var avimLabel = ["AUTO", "TELEX", "VNI", "VIQR", "VIQR*", "---", "OFF"];

    require("avim");

    /**
     * Cập nhật thông tin bộ gõ
     */
    function avimUpdateState() {

        avimOn = avimPreferences.get("on"); // Kiểm tra tình trạng bật/tắt
        
        var currMethod = avimPreferences.get("method");

        // Chọn kiểu gõ
        if (avimOn) {
            AVIMObj.setMethod(currMethod);
            $DropdownMethod.$button.text(avimLabel[currMethod]);
        } else {
            AVIMObj.setMethod(-1);
            currMethod = 6;
        }

        avimMenu.setChecked(avimOn); // Đánh dấu bật/tắt trên menu
        
        $DropdownMethod.$button.text(avimLabel[currMethod]); // Cập nhật thanh trạng thái kiểu gõ        
    }

    // Nếu chưa có thuộc tính bật/tắt
    if (avimOn === undefined) {
        avimOn = true;
        avimPreferences.set("on", true);
    }

    // Nếu chưa có thuộc tính kiểu gõ
    if (avimMethod === undefined) {
        avimPreferences.set("method", 0);
    }

    // Đăng ký command COMMAND_AVIM_ON
    var avimMenu = CommandManager.register("Bộ gõ AVIM", COMMAND_AVIM_ON, function () {
        avimOn = avimOn? false: true;
        avimPreferences.set("on", avimOn);
        avimUpdateState();
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU); // Gọi chức năng sửa menu
    menu.addMenuDivider(); // Thêm ngăn cách dòng
    menu.addMenuItem(COMMAND_AVIM_ON); // Thêm Bộ gõ AVIM vào menu
    // Đánh dấu Bật trên menu
    if (avimOn) {
        avimMenu.setChecked(true);
    }

    // Nếu chưa cài đặt phím tắt
    if (avimShortcut === undefined) {
        avimShortcut = {
            key: "Ctrl-Shift-G"
        };
        avimPreferences.set("shortcut", avimShortcut);
    }
    KeyBindingManager.addBinding(COMMAND_AVIM_ON, avimShortcut); // Thêm phím tắt cho command COMMAND_AVIM_ON

    // Tạo dropdown menu các kiểu gõ
    var $DropdownMethod = new DropdownButton.DropdownButton("OFF", avimLabel);

    // Gắn dropdown menu vào thanh trạng thái
    StatusBar.addIndicator("avim-status", $DropdownMethod.$button, true, "btn btn-dropdown btn-status-bar", "Chọn kiểu gõ Tiếng Việt", "status-overwrite");

    // Khi chọn một kiểu gõ từ dropdown menu
    $DropdownMethod.on("select", function (event, item, itemIndex) {
        if (itemIndex > 4) {
            avimPreferences.set("on", false);
        } else {
            avimPreferences.set("on", true);
            avimPreferences.set("method", itemIndex);
        }
        avimUpdateState();
    });

    // Khi extension đã sẵn sàng
    AppInit.appReady(function () {
        avimUpdateState();
    });

});
