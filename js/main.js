// main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store.js';
import router from './router.js';
import MaterialInfoPanel from './components/MaterialInfoPanel.vue';
import MaterialEditForm from './components/MaterialEditForm.vue';
import GoogleMap from './components/GoogleMap.vue';
import MarkerControlPanel from './components/MarkerControlPanel.vue';
import MarkerListPanel from './components/MarkerListPanel.vue';
import MarkerEditForm from './components/MarkerEditForm.vue';

const app = createApp(App);
app.use(store);
app.use(router);

// 注册组件
app.component('MaterialInfoPanel', MaterialInfoPanel);
app.component('MaterialEditForm', MaterialEditForm);
app.component('GoogleMap', GoogleMap);
app.component('MarkerControlPanel', MarkerControlPanel);
app.component('MarkerListPanel', MarkerListPanel);
app.component('MarkerEditForm', MarkerEditForm);

let map;
let markers = [];
let selectedCoordinates = null;
let materials = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -27.470125, lng: 153.021072 },
    zoom: 10,
  });
  
  // 点击地图时，保存坐标并更新显示，同时添加地图标记
  map.addListener("click", function(event) {
    const lat = event.latLng.lat().toFixed(6);
    const lng = event.latLng.lng().toFixed(6);
    selectedCoordinates = { lat, lng };
    document.getElementById("coordinates").textContent = `longitude: ${lng}, latitude: ${lat}`;
    addMarker(event.latLng);
  });
}

function addMarker(location) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: `longitude: ${location.lng().toFixed(6)}, latitude: ${location.lat().toFixed(6)}`
  });
  markers.push(marker);
}

// 渲染材料清单，同时显示材料属性和对应的坐标信息
function renderMaterialList() {
  const materialList = document.getElementById("material-list");
  materialList.innerHTML = "";
  materials.forEach((material, index) => {
    const li = document.createElement("li");
    li.textContent = `material category: ${material.name}, density: ${material.density} kg/m³, quantity: ${material.quantity}, volume: ${material.volume} m³, coordinates: (${material.lat}, ${material.lng})`;
    
    // 可选：添加删除按钮
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.onclick = () => {
      materials.splice(index, 1);
      markers[index].setMap(null);
      markers.splice(index, 1);
      renderMaterialList();
    };
    li.appendChild(deleteButton);
    materialList.appendChild(li);
  });
}

function downloadMaterialsAsCSV() {
  if (materials.length === 0) {
    alert("❌ 暂无材料数据可下载。");
    return;
  }
  const csvContent =
    "material category,density(kg/m³),quantity,volume(m³),latitude,longitude\n" +
    materials
      .map((m) => `${m.name},${m.density},${m.quantity},${m.volume},${m.lat},${m.lng}`)
      .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "material inventory database.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("✅ 材料库存数据已下载。");
}

function setupMaterialForm() {
  document.getElementById("save-material").addEventListener("click", function() {
    const name = document.getElementById("material-name").value;
    const density = parseFloat(document.getElementById("material-density").value);
    const quantity = parseInt(document.getElementById("material-quantity").value, 10);
    const volume = parseFloat(document.getElementById("material-volume").value);
    
    // 只有填写完整材料属性并且已选中地图坐标时才保存数据
    if (name && !isNaN(density) && !isNaN(quantity) && !isNaN(volume) && selectedCoordinates) {
      const newMaterial = { name, density, quantity, volume, ...selectedCoordinates };
      materials.push(newMaterial);
      renderMaterialList();
      console.log("已保存:", newMaterial);
      
      // 清空输入框和坐标显示
      document.getElementById("material-name").value = "";
      document.getElementById("material-density").value = "";
      document.getElementById("material-quantity").value = "";
      document.getElementById("material-volume").value = "";
      document.getElementById("material-coordinates").textContent = "";
      selectedCoordinates = null;
    } else {
      console.error("❌ 请填写完整的材料属性并选择位置。");
    }
  });
  
  document.getElementById("download-materials").addEventListener("click", downloadMaterialsAsCSV);
}

function setupMaterialInventory() {
  console.log("材料库存功能已启用");
  // 此处可添加材料库存的初始化逻辑
}

function setupImageUpload() { 
  const imageInput = document.getElementById("image-upload");
  const feedback = document.getElementById("image-upload-feedback");
  const previewContainer = document.getElementById("image-preview");

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      feedback.textContent = "❌ 仅支持 jpg、jpeg 和 png 格式";
      previewContainer.innerHTML = "";
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      feedback.textContent = "❌ 文件大小不能超过 5MB";
      previewContainer.innerHTML = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewContainer.innerHTML = `<img src="${e.target.result}" alt="上传的图片" style="max-width: 100%; height: auto; border: 1px solid #ccc; padding: 5px;">`;
      feedback.textContent = "✅ 上传成功！";
    };
    reader.readAsDataURL(file);
  });
}

window.onload = function() {
  if (!window.mapInitialized) {
    window.mapInitialized = true;
    initMap();
    setupMaterialForm();
    setupMaterialInventory();
    setupImageUpload();
    console.log("✅ 材料编辑功能与地图标记功能已启用");
  }
};

app.mount('#app');
