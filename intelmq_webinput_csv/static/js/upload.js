var vm_upload = new Vue({
    el: '#uploadApp',
    fileName: '#fileInput',
    data: {
        fileName: 'no file chosen',
        delimiterOptions: [';', ',', '#'],
        uploadFormData: {
            text: '',
            file: null,
            delimiter: ';',
            quotechar: '"',
            escapechar: '\\',
            useHeader: false,
            hasHeader: false,
            skipInitialSpace: false,
            skipInitialLines: 0,
            loadLinesMax: null,
        },
    },
    methods: {
        onChangeListener: function () {
            if (fileInput.files.length === 1) {
                this.fileName = fileInput.files[0].name;
                this.uploadFormData.file = fileInput.files[0];
            } else if (fileInput.files.length === 0) {
                return;
            } else {
                alert('please select only one file');
                return;
            }
        },
        readBody: function (xhr) {
            var data;
            if (!xhr.responseType || xhr.responseType === "text") {
                data = xhr.responseText;
            } else if (xhr.responseType === "document") {
                data = xhr.responseXML;
            } else {
                data = xhr.response;
            }
            return data;
        },
        submitButtonClicked: function () {
            var formData = new FormData();

            formData.append('text', this.uploadFormData.text);
            formData.append('file', this.uploadFormData.file);

            // obligatory data
            formData.append('delimiter', this.uploadFormData.delimiter);
            formData.append('quotechar', this.uploadFormData.quotechar);
            // formData.append('escapechar', this.uploadFormData.escapechar);
            formData.append('use_header', this.uploadFormData.useHeader);
            formData.append('has_header', this.uploadFormData.hasHeader);

            // optional data
            // should be implemented on server side
            // formData.append('skipInitialSpace', this.uploadFormData.skipInitialSpace);
            // formData.append('skipInitialLines', this.uploadFormData.skipInitialLines);
            // formData.append('loadLinesMax', this.uploadFormData.loadLinesMax);

            this.saveDataInSession();

            var request = new XMLHttpRequest();
            var self = this;

            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    var uploadResponse = self.readBody(request);
                    sessionStorage.setItem('uploadResponse', uploadResponse);
                    self.redirectToPreview();
                }
            };

            request.open('POST', 'http://localhost:5000/upload');
            request.send(formData);
        },
        saveDataInSession: function () {
            for (key in this.uploadFormData) {
                if ((key != 'text') && (key != 'file')) {
                    sessionStorage.setItem(key, this.uploadFormData[key]);
                }
            }
        },
        redirectToPreview: function () {
            window.location.href = 'preview.html';
        },
        clearAll: function () {
            console.log('clearAll');
        },
        loadDataFromSession: function () {
            for (key in this.uploadFormData) {
                if (sessionStorage.getItem(key) === null) {
                    continue;
                } else {
                    try {
                        this.uploadFormData[key] = JSON.parse(sessionStorage.getItem(key));
                    } catch (e) {
                        this.uploadFormData[key] = sessionStorage.getItem(key);
                    }
                }
            }
        },
    },
    beforeMount() {
        this.loadDataFromSession();
    }
});

// $('#form').change(function(){console.log('hui')});
