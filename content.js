// 创建浮动按钮和侧边栏
const floatingButton = document.createElement('button');
floatingButton.id = 'translate-btn';
floatingButton.textContent = '翻译';
floatingButton.style.display = 'none';

const sidebar = document.createElement('div');
sidebar.id = 'translate-sidebar';
sidebar.style.display = 'none';

// 添加关闭按钮
const closeButton = document.createElement('button');
closeButton.id = 'translate-close-btn';
closeButton.innerHTML = '&times;';
sidebar.appendChild(closeButton);

// 添加内容容器
const contentContainer = document.createElement('div');
contentContainer.id = 'translate-content';
sidebar.appendChild(contentContainer);

document.body.appendChild(floatingButton);
document.body.appendChild(sidebar);

// 监听关闭按钮点击事件
closeButton.addEventListener('click', () => {
  sidebar.style.display = 'none';
});

// 监听文本选择事件
document.addEventListener('mouseup', (e) => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    // 显示浮动按钮在选中文本附近
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    floatingButton.style.display = 'block';
    floatingButton.style.top = `${window.scrollY + rect.bottom + 10}px`;
    floatingButton.style.left = `${window.scrollX + rect.left}px`;
  } else {
    floatingButton.style.display = 'none';
  }
});

// 点击翻译按钮
floatingButton.addEventListener('click', async () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (!selectedText) {
    return;
  }

  try {
    sidebar.style.display = 'block';
    contentContainer.innerHTML = '<p>正在翻译中...</p>';

    // 通过 background script 发送翻译请求
    const response = await chrome.runtime.sendMessage({
      type: 'translate',
      text: selectedText
    });

    if (response.success) {
      contentContainer.innerHTML = `
        <div class="translation-result">
          <h3>原文:</h3>
          <p>${selectedText}</p>
          <h3>译文:</h3>
          <p>${response.translation}</p>
        </div>
      `;
    } else {
      throw new Error(response.error || '翻译失败');
    }
  } catch (error) {
    console.error('翻译出错:', error);
    contentContainer.innerHTML = `<p class="error">翻译失败: ${error.message}</p>`;
  }
}); 