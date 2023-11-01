import React from 'react';
import { shallow } from 'enzyme';
import AudioRecorder from '../../components/AudioRecorder.react';

describe('AudioRecorder Component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AudioRecorder />);
    expect(wrapper.exists()).toBe(true);
  });

  it('calls startRecording when recording prop is set to true', () => {
    const wrapper = shallow(<AudioRecorder />);
    wrapper.instance().startRecording = jest.fn();
    wrapper.setProps({ recording: true });
    console.log(wrapper.debug())
    expect(wrapper.instance().startRecording).toHaveBeenCalled();
  });
  it('calls stopRecording when recording prop is set to true', () => {
    const wrapper = shallow(<AudioRecorder />);
    wrapper.instance().startRecording = jest.fn();
    wrapper.instance().stopRecording = jest.fn();
    wrapper.setProps({ recording: true });
    wrapper.setProps({ recording: false });
    expect(wrapper.instance().stopRecording).toHaveBeenCalled();
  });

});
