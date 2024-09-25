require 'asciidoctor-pdf'

version = ''
sourcePath = "#{__dir__}/../rules/main.adoc"
File.open(sourcePath) do |file|
    file.each_line do |line|
        if (line.match?(/:revnumber:/))
            version = line.gsub(':revnumber: ', '').strip()
        end
    end
end
outputPath = "#{__dir__}/../rules/metzmatan-test-rulebook-#{version}.pdf"

puts "Building rulebook pdf from primary source file '#{sourcePath}' with version #{version}"
Asciidoctor.convert_file sourcePath, backend: 'pdf', safe: :unsafe, to_file: outputPath

puts "Complete! Generated '#{outputPath}'"
