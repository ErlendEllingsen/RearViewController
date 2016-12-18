var exec = require('exec');
var colors = require('colors');


var device = {
    interval: null,
    identifer_name: '046d:0826 Logitech, Inc.',
    bus_id: 0,
    device_id: 0
};

function getDeviceName() {

    exec('lsusb', function(err, out, code) {

        var list = out.toString();

        list = list.split('\n');
        //console.log(JSON.stringify(list));

        var foundCameraLine = null;

        for (var i = 0; i < list.length; i++) {
            var line = list[i];
            if (line.indexOf(device.identifer_name) != -1) {
                foundCameraLine = line;
                break;
            }
        }

        if (foundCameraLine === null) {
            console.log(colors.red('Camera not found... Looking for ' + device.identifer_name));
            process.exit(0);
        }

        device.bus_id = (foundCameraLine.split('Bus ')[1].split(' ')[0]);
        device.device_id = (foundCameraLine.split('Device ')[1].split(':')[0]);

        console.log('bus_id: '+  device.bus_id);
        console.log('device_id: '+  device.device_id);

        //console.log(out.toString());
        return;
    });

}

getDeviceName();


function fixDevice() {
    console.log(colors.red('Usb device error... Resetting...'));
    exec('sudo /home/pi/work/usbreset /dev/bus/usb/' + device.bus_id + '/' + device.device_id, function(err, out, code) {
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

function init() {
    getDeviceName();
    device.interval = setInterval(getDeviceName, (15 * 1000));
    updatepic();
}