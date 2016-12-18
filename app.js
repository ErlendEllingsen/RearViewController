var exec = require('exec');
var colors = require('colors');


var device = {};


function getDeviceName() {

    exec('lsusb', function(err, out, code) {
        console.log(out.toString());
        return;
    });

}

getDeviceName();


function fixDevice() {
    console.log(colors.red('Usb device error... Resetting...'));
    exec('sudo /home/pi/work/usbreset /dev/bus/usb/001/005', function(err, out, code) {
        console.log(colors.blue('Usb device error... Resetting...'));
        setTimeout(updatepic, 3000);
    });
}

function updatepic() {


exec('fswebcam -D 1 --no-banner -r 640x480 /var/www/html/image.jpg', function(err, out, code) {
        if (err != '') {
            fixDevice();
            return;
        }

        //console.log('hi! ' + out.toString());
        console.log(colors.white('Pic -- OK'));
        setTimeout(updatepic, 500);
});

}