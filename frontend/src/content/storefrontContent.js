export const supportEmail = "support@rushingtechnologies.com";
export const generalEmail = "info@strengthinorder.com";

const legalCommonIntro = {
  supportEmail: generalEmail,
  effectiveDate: "June 20, 2026",
};

export const faqItems = [
  {
    question: "How do orders ship?",
    answer:
      "Orders are fulfilled in the order they are received. Tracking is sent after fulfillment, and shipping times depend on the destination and the carrier selected at checkout.",
  },
  {
    question: "What is the difference between Core and Legacy?",
    answer:
      "Core is the public-facing apparel line. Legacy is award-only and is unlocked through approved codes or recognition flows; it is not sold as a normal retail collection.",
  },
  {
    question: "How should I choose a size?",
    answer:
      "Use the fit notes on the product detail page. Core tees and hoodies are cut for everyday wear with a tactical fit, while hats and award pieces follow their own sizing rules.",
  },
  {
    question: "Can I return or exchange an item?",
    answer:
      "Standard Core items can be returned or exchanged according to the return window posted on the Returns page. Award-only Legacy items are final unless they arrive damaged or the order is incorrect.",
  },
  {
    question: "Who do I contact for help?",
    answer: `Email ${supportEmail} and include your order name, the item in question, and a clear description of the issue.`,
  },
  {
    question: "Can I request a custom or bulk order?",
    answer:
      "Yes. Use the Contact page to send the order details, timeline, quantities, and any branding notes so the team can review the request.",
  },
];

export const legalPages = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Operational Policy",
    intro:
      "This policy explains what we collect, why we collect it, and how we use it when you interact with AEGIS Apparel.",
    ...legalCommonIntro,
    sections: [
      {
        title: "Information We Collect",
        body:
          "We collect information you provide directly, such as your name, email address, shipping address, and any message you send through the site. We also receive basic technical data such as device type, browser version, IP address, and page interactions to keep the site working and to diagnose issues.",
      },
      {
        title: "How We Use Information",
        body:
          "We use personal data to process orders, respond to support requests, send order updates, improve the website, and keep the storefront secure. If you subscribe to updates, we use your email address to send product and mission announcements until you opt out.",
      },
      {
        title: "Sharing",
        body:
          "We share data only with service providers needed to operate the store, including hosting, analytics, payment, fulfillment, and security tools. We do not sell personal information.",
      },
      {
        title: "Retention",
        body:
          "Order records, support messages, and related operational data are retained as long as needed for fulfillment, accounting, fraud prevention, and dispute resolution.",
      },
      {
        title: "Security",
        body:
          "We use technical and organizational safeguards to reduce risk, but no internet system is perfectly secure. If you believe your information was exposed, contact support immediately.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    eyebrow: "Site Terms",
    intro:
      "These terms govern your use of the site, the storefront, and any purchase or request submitted through the platform.",
    ...legalCommonIntro,
    sections: [
      {
        title: "Site Access",
        body:
          "You may use the site for lawful purposes only. You agree not to interfere with the site, attempt unauthorized access, or use the storefront in a way that disrupts other users or services.",
      },
      {
        title: "Orders and Pricing",
        body:
          "Prices, product availability, and product details may change without notice. We may refuse or cancel an order when inventory, payment, fulfillment, or fraud checks require it. If we cancel after payment, any authorized amount will be handled according to the payment provider's refund process.",
      },
      {
        title: "Intellectual Property",
        body:
          "All site content, branding, text, graphics, product imagery, and layout elements are owned by AEGIS Apparel or used with permission and may not be copied, reproduced, or redistributed without written approval.",
      },
      {
        title: "Disclaimer",
        body:
          "The site and its content are provided as-is. We do not guarantee uninterrupted operation, error-free content, or that the site will meet every user requirement at all times.",
      },
      {
        title: "Limitation of Liability",
        body:
          "To the fullest extent allowed by law, AEGIS Apparel will not be liable for indirect or consequential damages arising from site use, order delays, or service interruptions.",
      },
    ],
  },
  returns: {
    title: "Returns and Refunds",
    eyebrow: "Fulfillment Policy",
    intro:
      "This policy explains when items can be returned, exchanged, or refunded and how to start a request.",
    ...legalCommonIntro,
    sections: [
      {
        title: "Core Items",
        body:
          "Core apparel items can be returned or exchanged within 30 days of delivery if they are unworn, unwashed, and in original condition. Shipping charges are not refundable unless the return is caused by our error.",
      },
      {
        title: "Legacy Items",
        body:
          "Legacy items are award-only. They are final unless the item arrives damaged, misprinted, or materially different from the order record.",
      },
      {
        title: "Damaged or Incorrect Orders",
        body:
          "If an item arrives damaged or incorrect, contact support within 7 days of delivery with the order number and clear photos so we can resolve it quickly.",
      },
      {
        title: "Refund Timing",
        body:
          "Approved refunds are issued to the original payment method. Timing depends on the payment processor and your bank.",
      },
      {
        title: "Start a Return",
        body:
          `Email ${supportEmail} with your order number, item name, and reason for return to receive the next steps.`,
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    eyebrow: "Delivery Policy",
    intro:
      "This policy covers fulfillment timing, shipping methods, tracking, and delivery expectations.",
    ...legalCommonIntro,
    sections: [
      {
        title: "Processing",
        body:
          "Orders are processed in the order received. Processing time can vary based on inventory, customization, and seasonal demand.",
      },
      {
        title: "Shipping Methods",
        body:
          "Available shipping options are shown at checkout when applicable. Delivery estimates are provided by the carrier and may change after the order leaves our hands.",
      },
      {
        title: "Tracking",
        body:
          "When tracking is available, it is sent to the email address used at checkout after the package has been scanned by the carrier.",
      },
      {
        title: "Delays",
        body:
          "Weather, carrier delays, address issues, and customs checks can affect delivery. We will help investigate missing or delayed packages, but carrier errors may require a formal claim.",
      },
      {
        title: "Wrong Address",
        body:
          "You are responsible for entering a deliverable address. If a package is returned due to an incorrect address, reshipment may require additional postage.",
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    eyebrow: "Accessibility",
    intro:
      "We want the storefront to be usable by as many people as possible, including people using assistive technology.",
    ...legalCommonIntro,
    sections: [
      {
        title: "Our Approach",
        body:
          "We build with readable contrast, keyboard-friendly navigation, semantic structure, and clear focus states in mind. The goal is a site that works with screen readers, keyboard navigation, and modern mobile browsers.",
      },
      {
        title: "Known Limits",
        body:
          "Some visual effects, third-party embeds, and asset timing may still introduce rough edges. If you run into a problem, tell us exactly what page and what assistive technology you were using.",
      },
      {
        title: "Request Assistance",
        body:
          `If you need help accessing the site or completing a purchase, email ${supportEmail} and we will work with you directly.`,
      },
      {
        title: "Continuous Improvement",
        body:
          "Accessibility is an ongoing process. We review layout, color contrast, focus order, and interaction states as the site changes.",
      },
    ],
  },
};

export function getProductEditorial(product) {
  const category = product?.category || "apparel";
  const division = product?.division || "core";
  const baseFit =
    category === "hoodie"
      ? "Relaxed tactical cut. If you want a roomier layering fit, go one size up."
      : category === "hat"
        ? "Structured one-size cap with an adjustable fit."
        : category === "patch" || category === "sticker" || category === "coin"
          ? "Non-apparel piece. Size information is informational only."
          : "True-to-size fit with a modern athletic shape.";

  const care =
    category === "hoodie"
      ? [
          "Machine wash cold with like colors.",
          "Turn inside out before washing and avoid bleach.",
          "Tumble dry low or hang dry to preserve the print and shape.",
        ]
      : category === "hat"
        ? [
            "Spot clean only when possible.",
            "Do not soak the brim or use high heat.",
            "Air dry to preserve structure.",
          ]
        : [
            "Machine wash cold with like colors.",
            "Turn inside out to protect print and finish.",
            "Tumble dry low or hang dry for best longevity.",
          ];

  const whatMakesDifferent =
    division === "legacy"
      ? [
          "Legacy pieces are award-only and are not sold through the public shop.",
          "They carry a different access path and are intended to feel earned, not purchased.",
          "The product pages keep the same visual language as Core, but the messaging is stricter and more ceremonial.",
        ]
      : [
          "Core items are the public line and are intended for daily wear.",
          "Each Core piece emphasizes durability, legibility, and simple uniform presentation.",
          "The product story is centered on wearability rather than scarcity.",
        ];

  return {
    fit: baseFit,
    sizing:
      category === "tshirt"
        ? [
            "Use your normal tee size for a standard fit.",
            "Size up if you prefer a looser, more relaxed drape.",
            "Between sizes? Pick the larger size for a fuller chest and shoulder feel.",
          ]
        : category === "hoodie"
          ? [
              "Choose your usual hoodie size for a standard fit.",
              "Size up if you want extra room in the shoulders or want to layer underneath.",
            ]
          : category === "hat"
            ? [
                "Adjust the strap for your preferred fit.",
                "If the band feels tight, let it settle before judging the final fit.",
              ]
            : [
                "No clothing sizing guidance applies to this item.",
                "Review the notes below for handling and use.",
              ],
    care,
    whatMakesDifferent,
    highlights:
      category === "tshirt"
        ? [
            "Heavyweight cotton feel",
            "Front chest logo with back mark placement",
            "Built to hold shape through repeated wear",
          ]
        : category === "hoodie"
          ? [
              "Cold-weather layering piece",
              "Structured fit with everyday wearability",
              "Designed for durability and clean silhouette",
            ]
          : category === "hat"
            ? [
                "Low-profile structured profile",
                "Daily carry / off-duty wear",
                "Adjustable closure for easy fit changes",
              ]
            : [
                "Award piece or accessory",
                "Ceremonial presentation",
                "Handle as a keepsake",
              ],
  };
}
