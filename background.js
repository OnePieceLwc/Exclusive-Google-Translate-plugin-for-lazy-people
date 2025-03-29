// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'translate') {
    // 处理翻译请求
    handleTranslation(request.text)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // 保持消息通道开启以进行异步响应
  }
});

// 处理翻译请求的函数
async function handleTranslation(text) {
  try {
    const response = await fetch('https://api.lkeap.cloud.tencent.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-hZsNO8sajITBlRzgA9d0iKjC3Mu4ez2WSfoBvYBPPthUbc0l'
      },
      body: JSON.stringify({
        model: "deepseek-r1",
        messages: [
          {
            role: "system",
            content: "你是一位精通多语言的翻译大师，能够准确地将用户输入的内容进行高质量翻译。中译英，英译中。"
          },
          {
            role: "user",
            content: text
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format');
    }

    return {
      success: true,
      translation: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: '翻译请求失败: ' + error.message
    };
  }
} 