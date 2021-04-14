const _container = document.getElementById('sdv-container');
const ticket =
  '9ceb4ab676e5aa1767cabffa734e04210c9342d392d448e867a58e203ce93c2e64884da3e8dd64a785f6212e4b971472103e265698d8945298c6d6155d6c91ea5904f2cc7b6a12d9ef618584235b117b39b13ed809296597f8de1f9894879282b9006247f7442a322722ae3958df241a3d19da32d65a-cf09a421d217510a300a8ca73c578b0f';
// https://app.shapediver.com/m/talgoe-v1-4

const _viewerSettings = {
  container: _container,
  api: {
    version: 2,
  },
  ticket,

  modelViewUrl: 'eu-central-1',
};

const api = new SDVApp.ParametricViewer(_viewerSettings);

let viewerInit = false;

//////////////////////////////////////
// Doom Elements
const applyBtn = document.getElementById('apply-btn');
const pName = document.getElementById('name');
const pVal = document.getElementById('value');
const viewName = document.getElementById('view-name');
const formContainer = document.getElementById('view-container');

const min = document.getElementById('min');
const max = document.getElementById('max');

const visMål = document.getElementById('vis-mål');
const visTegning = document.getElementById('vis-tegning');
const downloadBtn = document.getElementById('download-btn');

api.scene.addEventListener(api.scene.EVENTTYPE.VISIBILITY_ON, function () {
  if (!viewerInit) {
    //////////////////////////////////////
    // For development purupses

    const parameters = api.parameters.get();
    console.log('Parameters Data:');
    console.log(parameters.data);

    const sceneData = api.scene.getData();
    console.log('Scene Data:');
    console.log(sceneData.data);

    const resExport = api.exports.get();
    console.log('Export Data');
    console.log(resExport.data);

    //////////////////////////////////////
    // Update Parameter
    const updateParameters = async (name, value) => {
      try {
        // Temp solution to hide all "tegning" elements when updateing any paramters for better performance
        // Ca 2 sec computeing uten tegning
        // ca 5 sec med tegning
        visTegning.checked = false;
        showTegning();

        const response = await api.parameters.updateAsync({
          name,
          value,
        });

        if (!response.err) {
          // console.log(response.data[0]);
          min.style.color = 'inherit';
          max.style.color = 'inherit';
        } else {
          console.log(`${response.err.toString()} (${value} @ ${name})`);
          min.style.color = 'red';
          max.style.color = 'red';
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getMinMaxValue = () => {
      //  get the the param that matches name of param input name/value
      const filtered = parameters.data.find((element) => element.name === pName.value);
      min.innerText = `${filtered.name} min value: ${filtered.min}`;
      max.innerText = `${filtered.name} max value: ${filtered.max}`;

      document.getElementById(
        'current'
      ).innerText = `${filtered.name} default value on load: ${filtered.defval}`;

      pVal.value = filtered.value;

      min.style.color = 'inherit';
      max.style.color = 'inherit';
    };
    getMinMaxValue();

    pName.addEventListener('change', getMinMaxValue);

    // Drop down view
    viewName.addEventListener('change', async () => {
      try {
        await api.parameters.updateAsync({
          name: 'View',
          value: viewName.value,
        });
      } catch (err) {
        console.log(err);
      }
    });

    applyBtn.addEventListener('click', () => {
      updateParameters(pName.value, pVal.value);
    });

    visMål.addEventListener('change', async () => {
      try {
        await api.parameters.updateAsync({
          name: 'Vis mål',
          value: visMål.checked,
        });
      } catch (err) {
        console.log(err);
      }
    });

    // Toggle tegning
    const showTegning = async () => {
      try {
        if (visTegning.checked) {
          downloadBtn.classList.remove('hidden');
          formContainer.classList.remove('hidden');

          // Set Drop down to the defualt value
          const filtered = parameters.data.find((element) => element.name === 'View');
          viewName.value = filtered.defval;

          // View Dropdown
          await api.parameters.updateAsync({
            name: 'View',
            value: filtered.defval,
          });
        } else {
          downloadBtn.classList.add('hidden');
          formContainer.classList.add('hidden');
        }

        // View toggle (true or false)
        await api.parameters.updateAsync({
          name: 'Vis 2D tegning',
          value: visTegning.checked,
        });
      } catch (err) {
        console.log(err);
      }
    };

    visTegning.addEventListener('change', showTegning);

    downloadBtn.addEventListener('click', () => {
      api.exports
        .requestAsync({ name: 'Download2d' })
        .catch(function (err) {
          return Promise.reject(err);
        })
        .then(function (response) {
          alert(response.data.msg);
          console.log(response.data);

          // console.log('File format: ', response.data.content[0].format);
          // console.log('File size: ', response.data.content[0].size);
          // console.log('Download link: ', response.data.content[0].href);
        });
    });

    // This need to be Last on the code
    viewerInit = true;
  }
});
