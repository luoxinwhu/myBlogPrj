/**
 * Created by 35943 on 2017/3/11.
 */

function PullDownMenu() {

    $('#app_bg').mouseover(function() {
        $('#app_pullDownList').show();
    }).mouseout(function () {
        $('#app_pullDownList').hide();
    });
}
PullDownMenu();
