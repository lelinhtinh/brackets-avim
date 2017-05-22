/*global define, brackets, AVIMObj */

define(function (require) {
    'use strict';

    require('vendor/avim');

    var COMMAND_ID = 'baivong.avim',
        COMMAND_LABEL = ['AUTO', 'TELEX', 'VNI', 'VIQR', 'VIQR*', '---', 'OFF'],

        EDITOR_MENU = 'avim-menu',
        EDITOR_STATUS = 'avim-status',

        AppInit = brackets.getModule('utils/AppInit'),
        StatusBar = brackets.getModule('widgets/StatusBar'),

        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        prefs = PreferencesManager.getExtensionPrefs(COMMAND_ID),

        DropdownButton = brackets.getModule('widgets/DropdownButton'),
        ddMethod = new DropdownButton.DropdownButton('OFF', COMMAND_LABEL),

        Menus = brackets.getModule('command/Menus'),
        menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU),

        CommandManager = brackets.getModule('command/CommandManager'),
        avimMenu = CommandManager.register('Bộ gõ AVIM', EDITOR_MENU, function () {
            var isActive = prefs.get('active') ? false : true;
            prefs.set('active', isActive);
            prefs.save();
        });


    prefs.definePreference('active', 'boolean', false);
    prefs.definePreference('method', 'number', 0);

    menu.addMenuDivider();
    menu.addMenuItem(EDITOR_MENU);

    StatusBar.addIndicator(EDITOR_STATUS, ddMethod.$button, true, 'btn btn-dropdown btn-status-bar', 'Chọn kiểu gõ Tiếng Việt', 'status-overwrite');

    ddMethod.on('select', function (event, item, itemIndex) {
        if (itemIndex === 6) { // OFF
            prefs.set('active', false);
        } else {
            prefs.set('active', true);
            prefs.set('method', itemIndex);
        }
        prefs.save();
    });

    prefs.on('change', function () {
        var isActive = prefs.get('active'),
            currentMethod = prefs.get('method');

        avimMenu.setChecked(isActive);
        if (isActive) {
            ddMethod.$button.text(COMMAND_LABEL[currentMethod]);
        } else {
            ddMethod.$button.text(COMMAND_LABEL[6]);
        }

        if (currentMethod < 0 || currentMethod > 4 || !isActive) currentMethod = -1;
        AVIMObj.setMethod(currentMethod);
    });

    AppInit.appReady(function () {
        prefs.trigger('change');
    });

});
