import React, {Component} from 'react';
import PropTypes from 'prop-types';

function getBrowserName() {

    if (navigator.userAgent.indexOf("Edge") !== -1) {
        return 'Edge';
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        return 'Firefox';
    }

    return 'unknown';
}


function downsampleAudio(buffer, sampleRate, outSampleRate) {
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        var accum = 0, count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }
        result[offsetResult] = Math.min(1, accum / count);
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result;
}

export default class AudioRecorder extends Component {

    constructor(props) {
        super(props);
        this.recording = false;
        this.sampleRate = props.sampleRate;
    }

    startRecording() {
        const {setProps, sampleRate} = this.props;
        if (this.micStream === undefined) {
            console.log("Creating Microphone Stream")
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            if (navigator.mediaDevices) {
                const constraints = {
                    audio: {
                        sampleSize: 16,
                        channelCount: 1,
                        /* https://blog.addpipe.com/audio-constraints-getusermedia/
                            most constraints are fixed or not supported, but if anything changes,
                            we can uncomment the below:
                            sampleRate: sampleRate,
                            noiseSuppression: true,
                            echoCancellation: true
                        */

                    },
                    video: false
                };
                const MicrophoneStream = require('microphone-stream').default;
                let options;
                if (getBrowserName() === 'Firefox') {
                    // In Firefox, if you try to supply a different sampling rate to the AudioContext
                    // you'll get a "Connecting AudioNodes from AudioContexts with different sample-rate is currently not supported."
                    // error.
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1664223
                    options = {}
                } else {
                    options = {sampleRate: sampleRate}
                }
                const micStream = new MicrophoneStream({
                    'context':
                        new AudioContext(options)
                })
                navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                    micStream.setStream(stream)
                }).catch(function (error) {
                    console.log(error);
                });
                micStream.on('data', function (chunk) {
                    let audio = MicrophoneStream.toRaw(chunk)
                    if (getBrowserName() === 'Firefox') {
                        console.log("Using Firefox browser - manually downsampling the signal")
                        // Since we couldn't supply the required sample rate to the audio context, we have
                        // to manually downsample here. The sample rate, by default, is 48kHz
                        // - https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/sampleRate
                        // - https://bugzilla.mozilla.org/show_bug.cgi?id=1400731
                        audio = downsampleAudio(audio, 48000, sampleRate)
                    }
                    setProps({audio: audio})
                });
                this.micStream = micStream
            }
        } else {
            this.micStream.playRecording()
        }
        console.log("Started recording");
    }

    stopRecording() {
        console.log("Stopped Recording");
        this.micStream.pauseRecording()
    }

    async componentDidUpdate(prevProps) {
        const {recording} = this.props;
        if ((prevProps.recording === false || prevProps.recording === undefined) && recording === true) {
            // if something triggered the recording flag to turn on,
            // start recording
            this.startRecording();
        } else if (prevProps.recording === true && recording === false) {
            // if something triggered the recording flag to turn off,
            // stop recording
            this.stopRecording();
        }
    }

    render() {
        return null;
    }

}

AudioRecorder.defaultProps = {
    sampleRate: 16000
}

AudioRecorder.propTypes = {

    /**
     * When this property is set, a message is sent with its content.
     */
    audio: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,
    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
    /**
     * Flag to indicate if we're currently recording
     */
    recording: PropTypes.bool,
    /**
     * Sampling rate in Hz
     */
    sampleRate: PropTypes.number
}
