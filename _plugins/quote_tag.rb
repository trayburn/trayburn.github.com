module Jekyll

  class QuoteTag < Liquid::Block

    def initialize(tag_name, caption, tokens)
      @caption = "<small>" + caption + "</small>"
      super
    end

    def render(context)
      source = "<div class='format-quote'><blockquote>"
      source += super
      source += @caption if @caption
      source += "</blockquote></div>"
      source
    end
  end
end

Liquid::Template.register_tag('quote', Jekyll::QuoteTag)
