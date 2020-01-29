var currentIndex = 0;
var musicList = [];
var totalSecond = 0;
var timePicker = 0;
var timePickerLine = 0;
var audioCtx = new AudioContext();

var viewBiner = function(id, event) {
    $(id).on("click", event)
}

var initBtnBord = function() {
    viewBiner("#next", function() {
        currentIndex++;
        if (currentIndex === musicList.length) {
            currentIndex = musicList.length - 1;
        }
        initMusicBord(musicList[currentIndex]);
    });

    viewBiner("#last", function() {
        currentIndex--;
        if (currentIndex === -1) {
            currentIndex = 0;
        }
        initMusicBord(musicList[currentIndex]);
    });

    $("#voice").on("input", function(data) {
        $("#voiceControl .valBar").text($("#voice").val());
    })

    $("#beats").on("input", function(data) {
        $("#beatsControl .valBar").text($("#beats").val());
    })
}

var initMusicBord = function(currentMusic) {
    $("#picContent").attr("src", currentMusic.path);
    $("#screen").text("当前曲谱：" + currentMusic.name);
}

var blink = function() {
    $("#controlLight").css("background", "#CC3333");
    var audioCtx = new AudioContext();
    var oscillator = audioCtx.createOscillator();
    // 创建一个GainNode,它可以控制音频的总音量
    var gainNode = audioCtx.createGain();
    // 把音量，音调和终节点进行关联
    oscillator.connect(gainNode);
    // audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
    gainNode.connect(audioCtx.destination);
    // 指定音调的类型，其他还有square|triangle|sawtooth
    oscillator.type = 'sine';
    // 设置当前播放声音的频率，也就是最终播放声音的调调
    oscillator.frequency.value = 350.00;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    // 0.01秒后音量为1
    gainNode.gain.linearRampToValueAtTime(1 * $("#voice").val() / 50, audioCtx.currentTime + 0.01);
    // 音调从当前时间开始播放
    oscillator.start(audioCtx.currentTime);
    // 1秒内声音慢慢降低，是个不错的停止声音的方法
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    // 1秒后完全停止声音
    oscillator.stop(audioCtx.currentTime + 0.2);
    setTimeout('$("#controlLight").css("background", "#06fefd");', 200);
}

var initFun = function() {
    $.get("./config/music.json", function(data, status) {
        musicList = JSON.parse(data);
        initMusicBord(musicList[0]);
    });
    initBtnBord();
    setInterval(function() {
        totalSecond++;
        let tempS = totalSecond;
        let hour = tempS / 3600;
        tempS = tempS % 3600;
        let minute = tempS / 60;
        tempS = tempS % 60;
        $("#hour").text(parseInt(hour));
        $("#minute").text(parseInt(minute));
        $("#second").text(tempS);
    }, 1000);

    setInterval(function() {
        if ($("#beats").val() != 0) {
            timePicker++;
            timePickerLine = 600 / $("#beats").val();
            if (timePicker >= timePickerLine) {
                timePicker = 0;
                blink();
            }
        }

    }, 100);
}



initFun();