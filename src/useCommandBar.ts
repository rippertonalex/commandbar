import { init } from 'commandbar';

// Initialize CommandBar with the provided key
init('2789cb70');

// Export the triggerNudge function for tracking button clicks
export function triggerNudge() {
  window.CommandBar.trackEvent('jim_halpert_button', {});
  return;
}

// Main functional component to set up CommandBar
const useCommandBar = () => {
  const loggedInUserId = '424242';

  // Boot CommandBar for the logged in user
  window.CommandBar.boot(loggedInUserId);

  // Add custom component to CommandBar
  window.CommandBar.addComponent('record-preview-with-image', 'Basic Record Preview with an image', {
    mount: (elem: HTMLElement) => ({
      render: (
        data: { label: string; id: string; good_boy_rating: number; photo: string; email: string },
        metadata: any,
      ) => {
        elem.innerHTML = `
          <div style="font-family: Arial, sans-serif; border: 1px solid #ccc; border-radius: 8px; padding: 16px; max-width: 300px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h3 style="margin-top: 0;">${data.label}</h3>
            <p><strong>ID:</strong> ${data.id}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #007BFF; text-decoration: none;">${data.email}</a></p>
            <p><strong>Good Boy Rating:</strong> ${data.good_boy_rating}/10</p>
            <input type="range" id="goodBoyRating-${data.id}" name="goodBoyRating" min="0" max="10" value="${data.good_boy_rating}" disabled style="width: 100%;">
            <div style="margin-top: 16px; text-align: center;">
              <img src="${data.photo}" alt="${data.label}" style="max-width: 100%; height: auto; border-radius: 8px;"/>
            </div>
          </div>`;
      },
      unmount: (elem: HTMLElement) => {
        // Clean up any timers, event handlers, etc.
      },
    }),
  });

  // Add records to CommandBar
  window.CommandBar.addRecords(
    'pets',
    [
      {
        label: 'Fido',
        id: 'foo42',
        good_boy_rating: 9,
        email: 'fido12@yahoo.com',
        photo: 'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg',
      },
      {
        label: 'Buster',
        id: 'bar43',
        email: 'buster123@gmail.com',
        good_boy_rating: 6,
        photo: 'https://i.ytimg.com/vi/C_lpU5DiJ0Y/maxresdefault.jpg',
      },
      {
        label: 'Brutus',
        id: 'baz44',
        email: 'bigbrutus12@gmail.com',
        good_boy_rating: 8,
        photo: 'http://cdn.akc.org/content/article-body-image/housetrain_adult_dog_hero.jpg',
      },
    ],
    { detail: { type: 'component', value: 'record-preview-with-image' } },
  );

  // Add record action with dynamic photo URL
  window.CommandBar.addRecordAction('pets', {
    text: 'view pets',
    name: 'view-pets',
    template: {
      type: 'link',
      value: '{{record.photo}}',
      operation: 'self', // how should the page open
    },
  });

  // Function to fetch cat facts from the API
  const onSearchCatFacts = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Fetching cat fact failed:', error);
      return { fact: 'Could not fetch a cat fact at this time.' };
    }
  };

  // Add argument choices for cat facts
  window.CommandBar.addArgumentChoices('cat-api', [], {
    onInputChange: async () => {
      const data = await onSearchCatFacts();
      return [{ name: 'Cat Fact', value: data.fact }];
    },
  });

  // Add callback to display cat fact
  window.CommandBar.addCallback('sayHi', async () => {
    const catFactResponse = await onSearchCatFacts();
    alert(`Here is a silly little cat fact from Jim Halpert, ${catFactResponse.fact}`);
  });

  // Additional functionality (contexts, other callbacks, etc.) can be added below
};

export default useCommandBar;
