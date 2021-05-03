const _container = document.getElementById('sdv-container');
// const ticket =
//   '26dc1972fa619ed5b5d9cc918a4bf2e5ddd323757d9cd4da623cc4fef6633311b1bf1bf3f2d69c2925c614bc6727b36329933e55254449d2bd07652909161d00822f888f82383f3b293325b990822c69f2eacdff6c5ad8f2f46ea911cd95d61bb3865a950f425e109bb50e9795677a22b4ca10e362d8-18541cd39125a5caf165af96da6d6f40';
// https://app.shapediver.com/m/talgoe-v1-18

const ticket =
  'e8520a550bc7683c06b52617d892c76fc65a5abc7c8d0f4ff83a82c51581cded87de40568ccac93e51a396f0a8d1171c2de914c10c3f436787d0ad4eb927ae6cfd0b0ce69c31920380816ff2844feddd6397ae4026397b9a633381d27287404e9d34dfb8ae96000c3cae7fdb9108f39ff189a47681fb-355b54a23ebcad7f5c20ece057cf266d';
// https://app.shapediver.com/m/talgoe-v1-17

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
        visTegning.checked = false;
        showTegning();
        // await api.parameters.updateAsync({
        //   name: 'Vis 2D tegning',
        //   value: false,
        // });

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
        visTegning.checked = true;
        showTegning();
        // togglePDF(true);
        directExport('DownloadPDF');
      } catch (err) {
        console.log(err);
      }
    });

    download3dModel.addEventListener('click', directExport.bind(null, 'Download3dModel'));
    // downloadPDF.addEventListener('click', directExport.bind(null, 'DownloadPDF'));

    // Toggle tegning
    const showTegning = async () => {
      try {
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
