# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class AudioRecorder(Component):
    """An AudioRecorder component.


Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- audio (dict | string; optional):
    When this property is set, a message is sent with its content.

- recording (boolean; optional):
    Flag to indicate if we're currently recording.

- sampleRate (number; default 16000):
    Sampling rate in Hz."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_recording_components'
    _type = 'AudioRecorder'
    @_explicitize_args
    def __init__(self, audio=Component.UNDEFINED, id=Component.UNDEFINED, recording=Component.UNDEFINED, sampleRate=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'audio', 'recording', 'sampleRate']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'audio', 'recording', 'sampleRate']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(AudioRecorder, self).__init__(**args)
