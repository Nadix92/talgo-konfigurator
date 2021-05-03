const _container = document.getElementById('sdv-container');

const ticket =
  'bcbc50ffe486eb7cea6606bff46d458787e305c00ef7ce53c535174582d630fa89a4de27a4e4533075387c95b1c6e620e9c7ed0497608662d8156c3cc8975bc8735833c63167575d06180a78a9a2bb66169d5d53d7c7a3e71ac62fc0bff4e3b6e70633435b0b1dcc83608f923f5288d475f0cad373cf-f026aa372bb346502fd3fa914764bb9a';
// https://app.shapediver.com/m/talgoe-v1-19

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

const min = document.getElementById('min');
const max = document.getElementById('max');

const download3dModel = document.getElementById('download-3d-model');
const downloadPDF = document.getElementById('download-pdf');
const spinner = document.getElementById('spinner');

const visTegning = document.getElementById('vis-tegning');

// const viewName = document.getElementById('view-name');
// const formContainer = document.getElementById('view-container');
// const visMål = document.getElementById('vis-mål');
// const downloadBtn = document.getElementById('download-btn');

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

    // api.parameters.updateAsync({
    //   name: 'Vis 2D tegning',
    //   value: true,
    // });

    //////////////////////////////////////
    // Update Parameter
    const updateParameters = async (name, value) => {
      try {
        // Toggle off tegning before update any parameter
        // togglePDF(false);
        // visTegning.checked = false;
        // showTegning();
        await api.parameters.updateAsync({
          name: 'FrontPDF',
          value: false,
        });

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
      const filtered = parameters.data.find(element => element.name === pName.value);
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

    applyBtn.addEventListener('click', () => {
      updateParameters(pName.value, pVal.value);
    });

    const directExport = name => {
      spinner.removeAttribute('hidden');
      api.exports
        .requestAsync({ name })
        .catch(function (err) {
          return Promise.reject(err);
        })
        .then(function (response) {
          spinner.setAttribute('hidden', '');
          if (response.data.msg) alert(response.data.msg);

          console.log(response.data);

          if (response.data.content.length !== 0) {
            console.log('File format: ', response.data.content[0].format);
            console.log('File size: ', response.data.content[0].size);
            console.log('Download link: ', response.data.content[0].href);

            window.location.href = response.data.content[0].href;
          }
        });
    };

    downloadPDF.addEventListener('click', async () => {
      try {
        // visTegning.checked = true;
        // showTegning();
        // togglePDF(true);

        await api.parameters.updateAsync({
          name: 'FrontPDF',
          value: true,
        });

        directExport('DownloadPDF');
      } catch (err) {
        console.log(err);
      }
    });

    download3dModel.addEventListener('click', directExport.bind(null, 'Download3dModel'));
    // downloadPDF.addEventListener('click', directExport.bind(null, 'DownloadPDF'));

    // Toggle tegning
    // const showTegning = async () => {
    //   try {
    //     // View toggle (true or false)
    //     await api.parameters.updateAsync({
    //       name: 'Vis 2D tegning',
    //       value: visTegning.checked,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // visTegning.addEventListener('change', showTegning);

    // value will be ture or false
    // const togglePDF = async value => {
    //   try {
    //     await api.parameters.updateAsync({
    //       name: 'FrontPDF',
    //       value,
    //     });

    //     await api.parameters.updateAsync({
    //       name: 'PerspectivePDF',
    //       value,
    //     });

    //     await api.parameters.updateAsync({
    //       name: 'TopPDF',
    //       value,
    //     });

    //     await api.parameters.updateAsync({
    //       name: 'RightPDF',
    //       value,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // This need to be Last on the code
    viewerInit = true;
  }
});

// ---------- OLD CODE FOR REFRENCE --------------------------

// Drop down view
// viewName.addEventListener('change', async () => {
//   try {
//     await api.parameters.updateAsync({
//       name: 'View',
//       value: viewName.value,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// visMål.addEventListener('change', async () => {
//   try {
//     await api.parameters.updateAsync({
//       name: 'Vis mål',
//       value: visMål.checked,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// Toggle tegning
// const showTegning = async () => {
//   try {
//     if (visTegning.checked) {
//       downloadBtn.classList.remove('hidden');
//       formContainer.classList.remove('hidden');

//       // Set Drop down to the defualt value
//       const filtered = parameters.data.find(element => element.name === 'View');
//       viewName.value = filtered.defval;

//       // View Dropdown
//       await api.parameters.updateAsync({
//         name: 'View',
//         value: filtered.defval,
//       });
//     } else {
//       downloadBtn.classList.add('hidden');
//       formContainer.classList.add('hidden');
//     }

//     // View toggle (true or false)
//     await api.parameters.updateAsync({
//       name: 'Vis 2D tegning',
//       value: visTegning.checked,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
// visTegning.addEventListener('change', showTegning);
